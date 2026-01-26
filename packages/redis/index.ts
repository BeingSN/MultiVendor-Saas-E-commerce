import { Redis } from "ioredis";

// Use REDIS_DATABASE_URL for Upstash
const redis = new Redis(process.env.REDIS_DATABASE_URL!, {
  tls: {}, // Required for Upstash SSL
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => console.log("✅ Connected to Upstash Redis"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
