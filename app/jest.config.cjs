module.exports = {
  preset: "jest-expo",
  fakeTimers: { doNotFake: ["setImmediate", "nextTick", "queueMicrotask"] },
  testMatch: ["<rootDir>/__tests__/unit/**/*.test.[jt]s?(x)"],
  moduleNameMapper: {
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^lucide-react-native$":
      "<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
    "^@mocks/(.*)$": "<rootDir>/../mocks/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(?:\\.pnpm|(?:jest-)?react-native|@react-native(?:-community)?/|expo(?:nent)?|@expo(?:nent)?/|@react-navigation/|@testing-library/react-native|react-native-css|nativewind|lucide-react-native))",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.types.ts",
    "!src/**/index.ts",
  ],
  passWithNoTests: false,
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.cjs"],
  resetMocks: true,
  restoreMocks: true,
};
