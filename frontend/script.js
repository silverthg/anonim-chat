const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const username = formData.get('username');
  const password = formData.get('password');

  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response.ok) {
    // Пользователь успешно зарегистрирован
    // Перенаправить на страницу ленты
    window.location.href = '/feed';
    console.log('Регистрация прошла успешно'); // Вывод успешного сообщения
  } else {
    // Ошибка регистрации
    // Обработать ошибку
    console.error('Ошибка регистрации:', response.statusText);
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get('username');
  const password = formData.get('password');

  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response.ok) {
    // Пользователь успешно авторизовался
    // Перенаправить на страницу ленты
    window.location.href = '/feed';
    console.log('Авторизация прошла успешно'); // Вывод успешного сообщения
  } else {
    // Ошибка авторизации
    // Обработать ошибку
    console.error('Ошибка авторизации:', response.statusText);
  }
});
