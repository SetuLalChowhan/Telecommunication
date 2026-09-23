import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Guardrail 1: UI files must not touch the transport layer directly
  {
    files: [
      "components/**/*.{ts,tsx}",
      "features/**/components/**/*.{ts,tsx}",
      "app/**/*.{ts,tsx}",
    ],
    ignores: ["app/api/**"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["axios"],
              message: "No raw HTTP in UI. Use a feature hook.",
            },
            {
              group: ["@/lib/api/client", "@/lib/api/server"],
              message: "UI imports feature hooks or prefetch helpers only.",
            },
          ],
        },
      ],
      "max-lines": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 120, skipBlankLines: true, skipComments: true }],
      complexity: ["warn", 10],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "warn",
    },
  },
  // Guardrail 2: lib/ must never depend on features/
  {
    files: ["lib/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@/features/*", "../features/*"],
              message: "lib/ must never import from features/",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
