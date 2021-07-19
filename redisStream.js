const Redis = require("ioredis");

require("dotenv").config();
const { REDIS_PORT, REDIS_HOST } = process.env;
const redis = new Redis(REDIS_HOST, REDIS_PORT);

const processMessage = (message) => {
  console.log(message[1][0]);
};

async function listenForMessage(lastId = "$") {
  const results = await redis.xread("block", 0, "STREAMS", "UserRegistered", lastId);
  const [key, messages] = results[0];

  messages.forEach(processMessage);

  await listenForMessage(messages[messages.length - 1][0]);
}

module.exports = listenForMessage