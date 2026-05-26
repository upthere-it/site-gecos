module.exports = {
  apps: [
    {
      name: "gecos-backend",
      cwd: "./backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        BACKEND_PORT: 3001,
      },
    },
    {
      name: "gecos-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        CONTENT_API_URL: "http://localhost:3001",
      },
    },
  ],
};
