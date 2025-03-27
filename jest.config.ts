import { defaults as tsjPreset } from 'ts-jest/presets'
import type { Config } from 'jest'

const config: Config = {
	testEnvironment: 'node',
	transform: tsjPreset.transform,
	verbose: true,
	forceExit: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
	detectOpenHandles: true,
	collectCoverage: true,
	cacheDirectory: 'coverage',
	collectCoverageFrom: ['src/**/*.ts'],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90
		}
	},
	coverageReporters: ['json-summary', 'lcov']
}

export default config
