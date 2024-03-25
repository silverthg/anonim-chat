const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const port = 3054;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const Post = mongoose.model("Post", postSchema);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (user) {
    const accessToken = jwt.sign({ username: user.username }, "secretKey");
    res.json({ accessToken });
  } else {
    res.status(401).send("Имя пользователя или пароль неверны");
  }
});

app.get("/posts", authenticateToken, async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).send("Пользователь уже существует");
  }

  const newUser = new User({ username, password });
  await newUser.save();
  res.json(newUser);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "secretKey", (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
