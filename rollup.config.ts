import { createRequire } from "node:module";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Plugin, RollupOptions } from "rollup";
import oxc from "rollup-plugin-oxc";

const DEV_MODE = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

const require = createRequire(import.meta.url);

const pkgJson = require("./package.json");

const meta = {
  name: pkgJson.name,
  description: pkgJson.description,
  version: pkgJson.version,
  author: pkgJson.author,
  ...pkgJson.tampermonkey,
};

export default {
  input: "src/index.ts",
  output: {
    file: "dist/output.js",
    format: "iife",
  },
  plugins: [
    oxc({
      minify: !DEV_MODE,
    }),
    buildMetaPlugin({
      meta,
      name: "output.meta.js",
      banner: DEV_MODE,
      requireLocal: DEV_MODE,
    }),
  ],
} satisfies RollupOptions;

const userScriptRegExp = /^\/\/\s*==UserScript==/;

function buildMeta(options: Record<string, any>): string {
  return `// ==UserScript==\n${Object.entries(options)
    .map(([key, value]) =>
      (Array.isArray(value) ? value : [value])
        .map(
          //
          (v) => `// @${key.padEnd(13)}${v}\n`
        )
        .join("")
    )
    .join("")}// ==/UserScript==\n`;
}

export function buildMetaPlugin({
  name,
  meta,
  banner = true,
  requireLocal,
}: {
  name?: string;
  meta?: Record<string, any>;
  banner?: boolean;
  requireLocal?: boolean;
} = {}): Plugin {
  const cache = new Set<string>();
  return {
    name: "build-meta",

    generateBundle({ file }, bundle) {
      if (!file || cache.has(file)) {
        return;
      }
      cache.add(file);

      const base = basename(file);
      if (banner) {
        const chunk = bundle[base];
        if (chunk?.type === "chunk" && !userScriptRegExp.test(chunk.code)) {
          chunk.code = buildMeta(meta) + chunk.code;
        }
      }
      if (!name) {
        return;
      }
      const metaRequires = new Set(meta?.require);
      if (requireLocal) {
        metaRequires.add(pathToFileURL(resolve(file)));
      }
      this.emitFile({
        type: "asset",
        fileName: name,
        source: buildMeta({
          ...meta,
          require: [...metaRequires],
        }),
      });
    },
  };
}
