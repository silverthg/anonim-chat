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


app.use(express.json()); // Для парсинга JSON в запросах
app.use(express.static('public'));
app.use(cors({ origin: '*' }));

const SECRET_KEY = 'your-secret-key'; // Используйте более сложный ключ на продакшене

const usersFilePath = 'users.json';

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Ошибка верификации токена:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Загрузка пользователей из файла при старте
fs.readFile(usersFilePath, (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // Если файл не существует, создаем пустой массив пользователей
      users = [];
      return;
    }
    console.error('Ошибка при загрузке пользователей:', err);
    return;
  }

  // Проверяем, не пуст ли файл
  if (data.length === 0) {
    // Если файл пуст, создаем пустой массив пользователей
    users = [];
    return;
  }

  // Пробуем прочитать данные из файла
  try {
    users = JSON.parse(data.toString());
  } catch (parseError) {
    console.error('Ошибка при парсинге данных:', parseError);
    // Если не удалось разобрать данные, устанавливаем пустой массив пользователей
    users = [];
  }
});


// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send('Все поля обязательные для заполнения.');
  }

  const isUserExists = users.some(user => user.username === username);
  if (isUserExists) {
    return res.status(409).send('Пользователь с таким именем уже существует.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, hashedPassword };
    users.push(newUser);

    // Здесь не забудьте обновить файл users.json, если используете его для хранения данных
    await fs.promises.writeFile(usersFilePath, JSON.stringify(users));

    const accessToken = jwt.sign({ username: newUser.username }, SECRET_KEY, { expiresIn: '1h' });

    console.log('**Успешная регистрация:**', username);
    res.status(201).json({ accessToken });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).send('Ошибка сервера.');
  }
});


// Авторизация пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).send('Пользователь не найден.');
  }

  bcrypt.compare(password, user.hashedPassword, (err, result) => {
    if (err) {
      console.error('Ошибка при проверке пароля:', err);
      return res.status(500).send('Ошибка сервера.');
    }

    if (!result) {
      return res.status(401).send('Неверный пароль.');
    }

    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ accessToken });
  });
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
