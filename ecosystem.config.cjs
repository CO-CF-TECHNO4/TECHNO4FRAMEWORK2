module.exports = {
  apps: [
    {
      name: 'T4F2',
      script: '../../node_modules/vite/bin/vite.js',
      cwd: 'apps/techno4-framework2-boonker',
      watch: false,
      env: {
        NODE_ENV: 'development',
        TECHNO4_THREADS_PORT: '8008'
      }
    }
  ]
};
