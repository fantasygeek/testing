module.exports = {
  apps: [
    {
      name: 'cnsclick-web',
      script: './.buid/next/standalone/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8080,
      },
    },
  ],
};
