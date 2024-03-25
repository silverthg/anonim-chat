const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const accessToken = jwt.sign({ username: user.username }, "secretKey");
    res.json({ accessToken });
  } else {
    res.status(401).send("Username or password is incorrect");
  }
});

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts);
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).send("User already exists");
  }

  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  res.json(newUser);
});

app.post("/posts", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: posts.length + 1, title, content };
  posts.push(newPost);
  res.json(newPost);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "secretKey", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
