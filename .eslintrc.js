module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/rule-name": "error",
    "prettier/prettier": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: ["plugin:@typescript-eslint/recommended"],
};
