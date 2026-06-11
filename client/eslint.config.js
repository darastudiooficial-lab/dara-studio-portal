import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import reactPlugin from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    ignores: ["**/*.cjs", "dist/**", "node_modules/**", "jest.config.js"]
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        alert: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        URL: "readonly",
        Blob: "readonly",
        URLSearchParams: "readonly",
        Headers: "readonly",
        localStorage: "readonly"
      }
    },
    plugins: {
      "unused-imports": unusedImports,
      react: reactPlugin
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error"
    }
  }
];
