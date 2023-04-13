const {loadEnvConfig} = require('@next/env');

// Make sure the environment variables for testing are loaded in the same way Next handles these
module.exports = async () => {
  const appDir = process.cwd();
  loadEnvConfig(appDir);
};
