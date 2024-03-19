const babel = require("@rollup/plugin-babel");
const { terser } = require("@wwa/rollup-plugin-terser");
const pkg = require("./package.json");
const json = require("@rollup/plugin-json");

const LIBRARY_NAME = "Hajar";
const EXTERNAL = [];
const GLOBALS = {};
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
