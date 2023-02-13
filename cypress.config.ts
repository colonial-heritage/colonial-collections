import {defineConfig} from 'cypress';

export default defineConfig({
  // desktop
  viewportWidth: 1536,
  viewportHeight: 960,
  e2e: {
    baseUrl: 'http://localhost:3000',
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
