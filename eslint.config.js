import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
    { ignores: ["dist", "vite.config.ts"] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            ...eslintPluginQuery.configs["flat/recommended"],
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            prettier: eslintPluginPrettier,
            "@tanstack/query": eslintPluginQuery,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-explicit-any": ["warn"],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-warning-comments": [
                "warn",
                {
                    terms: ["todo"],
                    location: "anywhere",
                },
            ],
        },
    },
);
