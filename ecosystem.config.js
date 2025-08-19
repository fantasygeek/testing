module.exports = {
  apps: [
    {
      name: 'cnsclick-web',
      script: './.next/standalone/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
