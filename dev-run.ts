import {
  clearFolders,
  addDefaultIndex,
  client,
  postcssPlugin,
  single,
  TypeChecker
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
    plugins: [postcssPlugin([require("tailwindcss")("./tailwindcss.dev.config.js")])],
    logLevel: "error",
    incremental: true,
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
      DEVELOPMENT: true,
    },
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    minify: false,
    bundle: true,
    platform: "browser",
    sourcemap: true,
    logLevel: "error",
    incremental: true,
  }
);

/**
 * index file for project
 */
addDefaultIndex({
  distFolder: "dist",
  entry: "./index.js",
  hbr: true,
  devServer: true,
  devServerPort: 80,
  userInjectOnHbr:
    'window.dispatchEvent(new CustomEvent("SIMPLE_HTML_SAVE_STATE"));',
  indexTemplate: /*html*/ `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <link href="./index.css" rel="stylesheet" />
         
          $bundle
        </head>
        <body>
        </body>
        </html>
        `,
});


const checker_client = TypeChecker({
  basePath: `./src`,
  name: 'client type check',
  tsConfig:'tsconfig.json'
});

checker_client.printSettings();
checker_client.inspectAndPrint();
checker_client.worker_watch(['./']);