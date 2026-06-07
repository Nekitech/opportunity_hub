import { Config } from 'jest';

module.exports = {
	verbose: true,
	testEnvironment: 'node',
	preset: 'ts-jest',
	transformIgnorePatterns: [
		'/node_modules/(?!(natural)/)',
	],
	maxWorkers: 1
} as Config;
