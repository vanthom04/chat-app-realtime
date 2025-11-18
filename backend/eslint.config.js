import { defineConfig } from "eslint/config"
import { configs as tsConfigs } from "typescript-eslint"

export default defineConfig([
  {
    files: ["**/*.ts"],
    ignores: ["node_modules/**", "dist/**", "src/generated/**"],
    extends: [tsConfigs.recommended],
    rules: {
      "semi": ["warn", "never"],
      "quotes": ["warn", "double"],
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "arrow-spacing": "warn",
      "comma-spacing": "warn",
      "keyword-spacing": "warn",
      "no-multi-spaces": "warn",
      "no-trailing-spaces": "warn",
      "no-useless-catch": "off",
      "array-bracket-spacing": "warn",
      "no-multiple-empty-lines": "warn",
      "object-curly-spacing": ["warn", "always"],
      "space-before-blocks": ["warn", "always"],
      "no-console": ["warn", { "allow": ["info", "warn", "error"] }],
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    }
  }
])
