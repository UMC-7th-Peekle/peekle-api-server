module.exports = {
  apps: [
    {
      name: "peekle",
      script: "./index.js",
      instances: 0, // 고정값 설정 (CPU 코어 수에 따라 조정 가능)
      exec_mode: "cluster",
      // watch: true, // nodemon과 같은 기능
      // ignore_watch: ["node_modules", "logs", "public", "uploads"], // watch 대상에서 제외할 경로
      // max_memory_restart: "2G", // 메모리 사용량이 2GB를 넘으면 재시작

      log_file: "./logs/pm2.combined.log",
      error_file: "./logs/pm2.error.log",
      out_file: "./logs/pm2.output.log",
    },
  ],
};
