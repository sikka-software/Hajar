const babel = require("@rollup/plugin-babel");
const { terser } = require("@wwa/rollup-plugin-terser");
const pkg = require("./package.json");
const json = require("@rollup/plugin-json");
const replace = require("@rollup/plugin-replace");
const path = require("path");

const LIBRARY_NAME = "Hajar"; // Change with your library's name
const EXTERNAL = []; // Indicate which modules should be treated as external
const GLOBALS = {}; // https://rollupjs.org/guide/en/#outputglobals
const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @homepage ${pkg.homepage}
 * @repository ${pkg.repository.url}
 * @license ${pkg.license}
 */`;

const makeConfig = (env = "development") => {
  let bundleSuffix = env === "production" ? "min." : "";

  return {
    input: "./www/src/@sikka/hajar/index.js",
    external: EXTERNAL,
    output: [
      {
        banner,
        name: LIBRARY_NAME,
        file: `dist/${LIBRARY_NAME}.umd.${bundleSuffix}js`, // UMD
        format: "umd",
        exports: "auto",
        globals: GLOBALS,
      },
      {
        banner,
        file: `dist/${LIBRARY_NAME}.cjs.${bundleSuffix}js`, // CommonJS
        format: "cjs",
        exports: "auto",
        globals: GLOBALS,
      },
      {
        banner,
        file: `dist/${LIBRARY_NAME}.esm.${bundleSuffix}js`, // ESM
        format: "es",
        exports: "auto",
        globals: GLOBALS,
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          '"./core/init.js"': JSON.stringify(
            path.resolve(__dirname, "./www/src/@sikka/hajar/core/init.js")
          ),
          '"./core/auth/index.js"': JSON.stringify(
            path.resolve(__dirname, "./www/src/@sikka/hajar/core/auth/index.js")
          ),
          '"../../../../package.json"': JSON.stringify(
            path.resolve(__dirname, "./package.json")
          ),
        },
      }),
      json(),
      babel({
        babelHelpers: "bundled",
        exclude: ["node_modules/**"],
      }),
      // typescript(),
    ],
  };
};

// Production build
const productionConfig = makeConfig("production");

// Add terser only for production build
productionConfig.plugins.push(
  terser({
    output: {
      comments: /^!/,
    },
  })
);

module.exports = (commandLineArgs) => {
  return commandLineArgs.environment === "BUILD:production"
    ? [makeConfig(), productionConfig]
    : [makeConfig()];
};
