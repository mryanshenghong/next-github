module.exports = {
  apps: [
    {
      name: "next-github",
      script: "./server.js",
      instances: 1,
      log_file: "/mnt/volume2/pm2/logs/next_github.log",
      error_file: "/mnt/volume2/pm2/logs/next_github.log",
      autorestart: false,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
