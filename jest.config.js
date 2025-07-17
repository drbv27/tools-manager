// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Asegurarnos de que el transform esté correcto para Next.js y TypeScript
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  // Esto es crucial si jest-dom u otras librerías usan ES Modules y están en node_modules
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm/)?(@testing-library|other-es-modules-you-use)/)", // Added .pnpm for pnpm users
  ],
};

module.exports = createJestConfig(customJestConfig);
