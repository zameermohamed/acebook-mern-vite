const dotenv = require("dotenv");
dotenv.config({ path: "./.env.test" });

/** @type {import('jest').Config} */
const config = {
  verbose: true, // Give more useful output
  maxWorkers: 1, // Make sure our tests run one after another

  // Add this to ignore specific files
  coveragePathIgnorePatterns: [
    "<rootDir>/app.js", // Exclude app.js file
    "<rootDir>/db/db.js", // Exclude db.js file
  ],
};

module.exports = config;
