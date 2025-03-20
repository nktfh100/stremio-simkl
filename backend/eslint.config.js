import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			prettier,
		],
		files: ["**/*.ts"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				NodeJS: true,
				process: true,
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-explicit-any": "off",
		},
	}
);
