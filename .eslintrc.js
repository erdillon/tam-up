module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "standard-with-typescript",
  overrides: [],
  ignorePatterns: ["**/*.js"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["unused-imports"],
  rules: {
    // we use 2 spaces to indent our code
    indent: ["error", 2],
    "comma-dangle": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "warn",
  },
};

