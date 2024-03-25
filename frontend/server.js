const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
const port = 3000;

// Простое in-memory хранилище данных
let users = [];
let posts = [];

app.use(cors());
app.use(express.json()); // Для парсинга JSON в запросах
app.use(express.static('public'));

const SECRET_KEY = 'your-secret-key'; // Используйте более сложный ключ на продакшене

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Регистрация пользователя
app.post('/register', (req, res) => {
  if (req.method === 'OPTIONS') {
    // Предварительный запрос CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
    return;
  }

  const { username, password } = req.body;

  // Проверка на пустые поля
  if (!username || !password) {
    res.status(400).send('Все поля обязательные для заполнения.');
    return;
  }

  // Проверка на уникальность пользователя
  const isUserExists = users.some(user => user.username === username);

  if (isUserExists) {
    res.status(400).send('Пользователь с таким именем уже существует.');
    return;
  }

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка регистрации.');
      return;
    }

    users.push({ username, hashedPassword });

    fs.writeFile('users.json', JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка регистрации.');
        return;
      }

      console.log('**Успешная регистрация:**', username);
      res.status(201).send('Пользователь зарегистрирован.');
    });
  });
});

// Авторизация пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('**Попытка авторизации:**', username, password);

  const user = users.find(user => user.username === username);

  if (!user) {
    console.log('**Ошибка:** Пользователь не найден');
    return res.status(401).send('Пользователь не найден');
  }

  // Сравнение паролей
  const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);

  if (!isPasswordValid) {
    console.log('**Ошибка:** Неверный пароль');
    return res.status(401).send('Пароль неверный');
  }

  // Создание токена
  const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, {
    expiresIn: '1h', // Например, 1 час
  });

  console.log('**Успешная авторизация:**', username);
  // Установка заголовка Access-Control-Allow-Origin для CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.send({ accessToken });
});

// Создание поста
app.post('/posts', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const newPost = { title, content, username: req.user.username };
  posts.push(newPost);
  res.status(201).send('Пост создан');
});

// Получение списка постов
app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
