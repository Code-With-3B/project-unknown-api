module.exports = {
  // Use TypeScript parser if your project uses TypeScript
  // For JavaScript projects, remove this line
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
  plugins: {
    "@typescript-eslint": {}, // Enable TypeScript ESLint plugin (if applicable)
  },
  rules: {
    // Add your custom ESLint rules here (optional)
    // Example:
    semi: ["error", "always"], // Enforce semicolons
    quotes: ["error", "double"], // Enforce double quotes
  },
};
