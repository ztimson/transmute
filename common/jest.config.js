module.exports = {
	"reporters": ["default", "jest-junit"],
	"roots": [
		"<rootDir>/tests"
	],
	"testMatch": [
		"**/?(*.)+(spec|test).+(ts|tsx|js)"
	],
	"transform": {
		".+\\.(ts)$": "ts-jest"
	},
	collectCoverageFrom: [
		'src/**/utils/**/*.ts',
		'!src/**/utils/**/*.d.ts'
	],
};
