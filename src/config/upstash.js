import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import "dotenv/config";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, "60 s"),
});

export default ratelimit;

// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const redis = Redis.fromEnv(); // UPSTASH_REDIS_REST_URL / _TOKEN を読む

// export const ratelimit = new Ratelimit({
//   redis,
//   // 🔽 Lua不要の固定窓に変更（同じ上限: 60秒で4回）
//   limiter: Ratelimit.fixedWindow(4, "60 s"),
//   prefix: "@upstash/ratelimit:wallet", // 任意
// });
