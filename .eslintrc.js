/** @type {import('eslint').CLIEngine.Options} */
module.exports = {
    reportUnusedDisableDirectives: true,
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module",
    },
    env: {
        es6: true,
        browser: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint",
        "plugin:jsx-a11y/recommended",
    ],
    plugins: ["@typescript-eslint", "react-hooks", "sort-imports-es6-autofix"],
    rules: {
        // sort系
        "sort-imports-es6-autofix/sort-imports-es6": [
            2,
            {
                // 通常のsort-importsではautofixが効かないパターンが多いため
                ignoreCase: false,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
            },
        ],
    },
    settings: {
        react: {
            version: "detect",
        },
        node: {
            tryExtensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".node"],
        },
    },
    overrides: [
        {
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: "./tsconfig.eslint.json",
                createDefaultProgram: true,
            },
            files: ["**/*.ts", "**/*.tsx"],
            rules: {
                "no-undef": "off",
                // typescript
                "node/no-unsupported-features/es-syntax": 0,

                "no-dupe-class-members": 0,
                "no-unused-vars": 0,
                "@typescript-eslint/no-unused-vars": [2, { args: "none" }],

                "no-array-constructor": 0,
                "@typescript-eslint/no-array-constructor": 2,

                "@typescript-eslint/adjacent-overload-signatures": 2,
                "@typescript-eslint/no-namespace": [
                    2,
                    { allowDeclarations: true },
                ],
                "@typescript-eslint/prefer-namespace-keyword": 2,

                "@typescript-eslint/no-require-imports": 2,
                "@typescript-eslint/no-var-requires": 2,
                "@typescript-eslint/consistent-type-assertions": 2,
                "@typescript-eslint/no-unnecessary-type-assertion": 2,
                "@typescript-eslint/restrict-plus-operands": 2,
                "@typescript-eslint/unbound-method": [
                    "error",
                    {
                        ignoreStatic: true,
                    },
                ],
                "@typescript-eslint/no-extra-non-null-assertion": ["error"],
                "@typescript-eslint/no-floating-promises": ["error"],

                // react-hooks
                "react-hooks/rules-of-hooks": "error",
                "react-hooks/exhaustive-deps": "warn",
                "react/jsx-key": 0,

                // react typescript
                "@typescript-eslint/explicit-function-return-type": "off",
                "react/prop-types": "off",

                // es2018
                "prefer-object-spread": "error",

                "no-console": ["error", { allow: ["error", "warn"] }],

                "no-case-declarations": 2,
                "react/no-unescaped-entities": 2,

                // for React.forwardRef
                "react/display-name": "off",
            },
        },
        {
            files: ["**/*.test.tsx", "**/*.test.ts", "**/__tests__/*.js"],
            env: {
                jest: true,
            },
            rules: {
                "no-invalid-this": 0,
            },
        },
        {
            files: ["*.js", "*.config.js", "config.js"],
            env: {
                node: true,
            },
        },
    ],
}
