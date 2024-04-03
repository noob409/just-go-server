module.exports = {
  apps: [
    {
      name: "just-go-server",
      script: "./src/server.js",
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
