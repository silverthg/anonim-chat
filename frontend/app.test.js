import axios from 'axios';
import { expect } from 'chai';

// Функция для получения токена
async function authenticateUser() {
  try {
    const authResponse = await axios.post('http://mivt22.kit-imi.info:3054/login', {
      username: 'a@mail.ru', // Замените на фактическое имя пользователя
      password: '123123123'  // Замените на фактический пароль
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (authResponse.status === 200) {
      return authResponse.data.accessToken; // Предполагаем, что сервер возвращает accessToken в JSON ответе
    }
    throw new Error('Authentication failed');
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

describe("GET: /api/posts", function() {
  let token;

  before(async function() {
    this.timeout(10000); // Установка большего таймаута для аутентификации
    token = await authenticateUser(); // Получение токена перед тестами
  });

  it("should return 200 OK status", async function() {
    this.timeout(5000); // Задаём таймаут, если запрос может занять больше времени
    const response = await axios.get("http://mivt22.kit-imi.info:3054/posts", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status).to.equal(200);
  });

  it("should return data in the correct format", async function() {
    this.timeout(5000); // Задаём таймаут, если запрос может занять больше времени
    const response = await axios.get("http://mivt22.kit-imi.info:3054/posts", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const responseData = response.data;
    expect(responseData).to.be.an('array');
  });
});
