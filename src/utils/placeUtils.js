import redis from "redis";

const EXPIRATION_TIME = 86400; // 24 hours

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect();

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
};

export const setCache = async (key, data) => {
  try {
    await redisClient.setEx(key, EXPIRATION_TIME, JSON.stringify(data));
  } catch (error) {
    console.error("Redis set error:", error);
  }
};
