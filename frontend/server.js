const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
// Middleware для разрешения CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить доступ с любых источников
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Разрешенные методы запросов
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешенные заголовки
  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Принимаем предварительные запросы
  } else {
    next();
  }
});
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200); // Отправляем успешный ответ для предварительных запросов
});

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration

app.post('/api/register', (req, res) => {
  // Получаем данные из запроса
  const requestData = req.body;

  // Делаем что-то с полученными данными (здесь просто отправляем обратно)
  res.json({ message: 'Данные успешно получены', data: requestData });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порте ${port}`);
});
fetch('/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key: 'value' }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error));
