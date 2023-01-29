const {loadEnvConfig} = require('@next/env');

// Make sure the environment variables for testing are loaded in the same way Next handles these
module.exports = async () => {
  loadEnvConfig(process.cwd());
};
