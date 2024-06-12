module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
  },
  env: {
    es6: true,
  },
  plugins: ["prettier", "@typescript-eslint"],
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        arrowParens: "avoid",
        bracketSpacing: false,
        printWidth: 120,
        quoteProps: "consistent",
        semi: false,
        singleQuote: true,
        tabWidth: 4,
        useTabs: false,
        trailingComma: "none",
        endOfLine: "auto",
      },
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "none",
          requireLast: false,
        },
        singleline: {
          delimiter: "comma",
          requireLast: false,
        },
      },
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "sort-imports": [
      "error",
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["all", "single", "multiple", "none"],
      },
    ],
  },
};
