module.exports = {
  rootDir: '.',
  setupTestFrameworkScriptFile: './jest.setup.js',
  globals: {
    'ts-jest': {
      tsConfigFile: 'src/tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
  transform: {
    '^.+\\.(ts|js|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
  },
  testMatch: ['<rootDir>/src/(app|lib)/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@duet-robot/service': '<rootDir>/src/app/@core/services',
    '^@duet-robot/(.*)': '<rootDir>/src/lib/$1',
  },
  modulePathIgnorePatterns: ['dist', '.history'],
};