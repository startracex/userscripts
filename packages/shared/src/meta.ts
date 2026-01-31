import { basename, resolve } from "path";
import type { Plugin } from "rollup";
import { pathToFileURL } from "url";

const userScriptRegExp = /^\/\/\s*==UserScript==/;

export const buildMeta = (options: Record<string, any>): string => {
  return `// ==UserScript==\n${Object.entries(options)
    .map(([key, value]) =>
      (Array.isArray(value) ? value : [value])
        .map(
          //
          (v) => `// @${key.padEnd(13)}${v}\n`,
        )
        .join(""),
    )
    .join("")}// ==/UserScript==\n`;
};

export function buildMetaPlugin({
  name,
  meta,
  banner: emitBanner = true,
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
      if (emitBanner) {
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
