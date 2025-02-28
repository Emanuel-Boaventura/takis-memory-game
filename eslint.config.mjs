import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config} */
const config = {
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  languageOptions: { globals: { ...globals.browser, ...globals.node } },
  rules: {
    // Autocomplete should work here
    "no-console": "warn",
    "quotes": ["warn", "single"],
    "semi": ["warn", "never"],
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  config,
];