import {
  clearFolders,
  addDefaultIndex,
  client,
  postcssPlugin,
  single,
  minifyHTMLLiteralsPlugin,
} from "esbuild-helpers";

clearFolders("dist");

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(
  { watch: "./src/**/*.css" },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src/index.css"],
    outfile: "./dist/index.css",
    plugins: [
      postcssPlugin([require("tailwindcss")("./tailwindcss.prod.config.js")]),
    ],
    logLevel: "error",
    incremental: false,
  }
);

/**
 * client bundle
 */
client(
  { watch: "./src/**/*.ts" },
  {
    color: true,
    define: {
      DEVELOPMENT: false,
    },
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    plugins: [minifyHTMLLiteralsPlugin()],
    minify: true,
    bundle: true,
    platform: "browser",
    sourcemap: false,
    logLevel: "error",
    incremental: false,
  }
);

/**
 * index file for project
 */
addDefaultIndex({
  distFolder: "dist",
  entry: "./index.js",
  indexTemplate: /*html*/ `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <link href="./index.css" rel="stylesheet" />
            <script src="./index.js"></script>
          </head>
          <body>
          <app-root></app-root>
          </body>
          </html>
          `,
});
