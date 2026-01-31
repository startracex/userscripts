import { getPackages, type Package as manypkg_Packages } from "@manypkg/get-packages";
import { buildMetaPlugin } from "@userscripts/shared/meta";
import { join } from "path";
import type { RollupOptions } from "rollup";
import oxc from "rollup-plugin-oxc";

type Package = manypkg_Packages & {
  packageJson: Record<string, any>;
};

const DEV_MODE = process.env.NODE_ENV === "development";
const outDir = "dist";
const { packages } = await getPackages(".");

const repo = "startracex/userscripts";
const rawBase = `https://raw.githubusercontent.com/${repo}/release`;

const normalize = (path: string) => path.replaceAll("\\", "/");

const options = (packages as Package[])
  .filter((p) => p.packageJson.tampermonkey)
  .flatMap((p) => {
    const input = join(p.relativeDir, "src/index.ts");
    const name = p.packageJson.name.split("/").pop();
    const rawBaseName = `${rawBase}/${name}`;
    const dir = normalize(p.relativeDir);
    const meta = {
      version: p.packageJson.version,
      ...p.packageJson.tampermonkey,
      updateURL: `${rawBaseName}.js`,
      downloadURL: `${rawBaseName}.js`,
      namespace: "https://github.com/startracex",
      homepage: `https://github.com/${repo}/blob/main/${dir}`,
      homepageURL: `https://github.com/${repo}/blob/main/${dir}/README.md`,
      supportURL: `https://github.com/${repo}/issues`,
    };
    return [
      {
        input,
        output: {
          file: join(outDir, `${name}.js`),
          format: "iife",
        },
        plugins: [
          oxc({ minify: !DEV_MODE }),
          buildMetaPlugin({
            name: `${name}.meta.js`,
            meta,
            banner: true,
            requireLocal: DEV_MODE,
          }),
        ],
      },
      !DEV_MODE && {
        input: input,
        output: {
          file: join(outDir, `${name}.dev.js`),
          format: "iife",
        },
        plugins: [
          oxc({ minify: false }),
          buildMetaPlugin({
            meta: {
              ...meta,
              updateURL: `${rawBaseName}.dev.js`,
              downloadURL: `${rawBaseName}.dev.js`,
            },
            banner: true,
          }),
        ],
      },
    ] satisfies RollupOptions[];
  })
  .filter(Boolean);

export default options;
