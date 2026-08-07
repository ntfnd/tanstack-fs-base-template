import stylistic from "@stylistic/eslint-plugin"
import lowComplexity from "eslint-plugin-low-complexity"
import essential from "eslint-plugin-essential"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"

const eslintConfig = [
    {
        ignores: [
            "**/routeTree.gen.ts",
            "src/styles/soft-club*.css",
            "src/components/soft-club/**",
            "src/hooks/soft-club/**",
            "src/lib/soft-club/**",
            "dist/**",
            ".output/**",
        ],
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            "@stylistic": stylistic,
            "@typescript-eslint": tseslint,
            "eslint-plugin-low-complexity": lowComplexity,
            "eslint-plugin-essential": essential,
            "react": reactPlugin,
            "react-hooks": reactHooks,
        },
        settings: {
            react: { version: "detect" },
        },
        rules: {
            "eslint-plugin-low-complexity/jsx-naming-convention": ["error"],
            "eslint-plugin-low-complexity/jsx-function-naming-convention": ["error"],
            "eslint-plugin-essential/max-nested-loops": ["error", { maxDepth: 1 }],
            "eslint-plugin-essential/max-nested-conditions": ["error", { maxDepth: 1 }],
            "eslint-plugin-essential/max-alternative-conditions": ["error", { maxElseIf: 0 }],
            "eslint-plugin-essential/no-else": ["error"],
            "eslint-plugin-essential/pattern-comment": ["error", { allowPattern: "^((TODO|FIXME|NOTE|BUG|HACK|OPTIMIZE|REVIEW|SECURITY):|@(public|private|deprecated))" }],
            "eslint-plugin-essential/pattern-restricted-import": ["error", [
                "^\\../"
            ]],
            "eslint-plugin-essential/pattern-sort-import": ["error", [
                "^react$",
                "^react-dom",
                "^@tanstack",
                "^@prisma/client",
                "^@radix-ui",
                "^lucide-react",
                "^class-variance-authority",
                "^clsx",
                "^tailwind-merge",
                "^@/core/domain",
                "^@/core/application",
                "^@/infrastructure",
                "^@/presentation",
                "^@/hooks",
                "^@/lib",
                "^@/components/soft-club",
                "^@/components",
                "^@/routes",
                "^@/styles",
                "^@/tests",
                "^\\.",
            ]],
            "arrow-body-style": ["error", "as-needed"],
            "func-style": ["error", "declaration", { allowArrowFunctions: true }],
            "max-classes-per-file": ["error", 1],
            "no-alert": "error",
            "no-bitwise": "error",
            "no-console": ["error", { allow: ["warn", "error"] }],
            "no-eq-null": "error",
            "no-debugger": "error",
            "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
            "no-multi-str": "error",
            "no-multi-assign": "error",
            "no-nested-ternary": "error",
            "no-return-assign": "error",
            "no-ternary": "error",
            "object-curly-spacing": ["error", "always", { objectsInObjects: false }],
            "react-hooks/exhaustive-deps": "off",
            "@stylistic/comma-spacing": ["error", { before: false, after: true }],
            "@stylistic/indent": ["error", 4],
            "@stylistic/key-spacing": ["error"],
            "@stylistic/space-before-blocks": "error",
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/semi": ["error", "never"],
            "@stylistic/space-infix-ops": "error",
            "@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always", catch: "always" }],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    modifiers: ["const"],
                    format: ["camelCase", "PascalCase", "UPPER_CASE"],
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
                {
                    selector: "function",
                    format: ["camelCase"],
                },
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "enumMember",
                    format: ["PascalCase", "UPPER_CASE"],
                },
            ],
            "react/function-component-definition": [
                "error",
                {
                    namedComponents: "arrow-function",
                    unnamedComponents: "arrow-function",
                },
            ],
            "react/jsx-wrap-multilines": [
                "error",
                {
                    return: "parens-new-line",
                },
            ],
        },
    },
]

export default eslintConfig
