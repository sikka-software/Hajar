const { NODE_ENV } = process.env;

export const presets = [
  [
    "@babel/preset-env",
    {
      modules: NODE_ENV === "test" ? "auto" : false,
    },
  ],
];
export const plugins = ["@babel/plugin-proposal-object-rest-spread"];
