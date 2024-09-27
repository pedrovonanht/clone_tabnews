import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: { ecmaVersion: 16 },
  },
  { languageOptions: { globals: { ...globals.node } } }, //make eslint recognize node global variables (like procces.env)
  { languageOptions: { sourceType: "module" } }, // make him not implicate with import export sintax
  pluginJs.configs.recommended, // pull a bunch of preset recomended rules for js
  pluginReact.configs.flat.recommended, // pull a bunch of preset recomended rules for react
  { ignores: ["**/.next/*", "**/node_modules/*", "**/migrations", "**/tests"] },
  {
    rules: {
      "react/react-in-jsx-scope": "off", // make not necessary to import react explicity
    },
  },
];
