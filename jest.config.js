export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "node",
  testTimeout: 30000,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)$": "$1",
  },
  roots: ["<rootDir>"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};
