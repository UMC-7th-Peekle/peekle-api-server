// const redisClient = createClient({
//   url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
//   socket: {
//     reconnectStrategy: (retries) => {
//       if (retries > 10) {
//         return new Error("Redis 연결 재시도 한도 초과");
//       }
//       return Math.min(retries * 50, 2000);
//     },
//   },
// });

// redisClient.on("connect", () => console.log("Redis Client Connected"));
// redisClient.on("error", (err) => console.error("Redis Client Error", err));
// await redisClient.connect();

// class RedisTransport extends Transport {
//   constructor(opts) {
//     super(opts);
//     this.redisClient = opts.redisClient;
//     this.name = "RedisTransport";
//   }

//   log(info, callback) {
//     setImmediate(() => {
//       this.emit("logged", info);
//     });

//     // 로그를 Redis에 저장하는 로직
//     this.saveToRedis(info)
//       .then(() => callback(null, true))
//       .catch((error) => callback(error));
//   }

//   async saveToRedis(info) {
//     console.log("Redis에 로그 저장:", info);
//     await this.redisClient.xAdd("peekle", "*", info);
//   }
// }
