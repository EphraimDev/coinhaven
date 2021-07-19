const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");
const listenForMessage = require("./redisStream");

require("dotenv").config();
const { PORT, REDIS_PORT, REDIS_HOST } = process.env;

const app = express();
const redis = new Redis(REDIS_HOST, REDIS_PORT);

redis.on("error", (err) => {
  console.log(err);
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());

listenForMessage();

app.get("/", (_req, res) => {
  return res.send("Coinhaven API using Nodejs and redis");
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(422).json({
        message: "Incomplete request data",
      });
    }

    const userExist = await redis.get(`user_${email}`);

    if (userExist) {
      return res.status(400).json({
        message: "account exist already",
      });
    }

    await redis.set(
      `user_${email}`,
      JSON.stringify({
        email,
        name,
        password,
      })
    );

    redis.xadd("UserRegistered", "*", email, Math.random());

    return res.status(201).json({
      message: "account created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(PORT || 3000, () => {
  console.log(`API listening on PORT ${PORT}`);
});
