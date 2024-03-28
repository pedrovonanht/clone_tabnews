require('dotenv').config({ path: '.env.development' })
const nextJest = require('next/jest')
const createJestConfig = nextJest();
const JestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = JestConfig