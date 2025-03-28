import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierRecommended from 'eslint-config-prettier'

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	prettierRecommended,
	{
		ignores: ['dist/', 'jest.config.js']
	},
	{
		files: ['**/__tests__/*.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off'
		},
		languageOptions: {
			globals: {
				jest: true
			}
		}
	}
)
