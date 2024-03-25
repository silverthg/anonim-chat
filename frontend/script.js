const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const postsContainer = document.getElementById('posts-container');
const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-content');
const submitPost = document.getElementById('submit-post');

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const username = formData.get('username');
      const password = formData.get('password');

      // Проверка на пустые поля
      if (!username || !password) {
        alert('Все поля должны быть заполнены!');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          // Пользователь успешно зарегистрирован
          // Перенаправить на страницу ленты
          window.location.href = 'main_page.html';
          console.log('Регистрация прошла успешно'); // Вывод успешного сообщения
        } else if (response.status === 409) {
          // Если пользователь с таким именем уже существует
          // Вывести сообщение на сайте с предложением авторизоваться
          alert('Пользователь с таким именем уже существует. Пожалуйста, авторизуйтесь.');
        } else {
          // Обработать другие ошибки регистрации
          console.error('Ошибка регистрации:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const username = formData.get('username');
      const password = formData.get('password');

      // Проверка на пустые поля
      if (!username || !password) {
        alert('Все поля должны быть заполнены!');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const jwt = await response.text();
          // Установка токена в локальное хранилище
          localStorage.setItem('accessToken', jwt);
          console.log('Авторизация прошла успешно'); // Вывод успешного сообщения
          // Пользователь успешно авторизовался
          // Перенаправить на страницу ленты
          console.log('Пытаюсь перенаправить на main_page.html');
          window.location.href = 'main_page.html';
        } else {
          // Ошибка авторизации
          // Обработать ошибку
          console.error('Ошибка авторизации:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }
    });
  }
});

// Main Page //

// Обработчик отправки поста
document.addEventListener('DOMContentLoaded', () => {
  const submitPost = document.getElementById('submit-post');
  const postTitle = document.getElementById('post-title');
  const postContent = document.getElementById('post-content');

  submitPost.addEventListener('click', async () => {
    const title = postTitle.value; // Получаем значение заголовка
    const content = postContent.value; // Получаем текст поста

    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ title, content }), // Отправляем и название, и текст
      });

      if (response.ok) {
        // Пост успешно создан
        postTitle.value = ''; // Очищаем поля ввода
        postContent.value = '';
        getPosts(); // Обновляем ленту
      } else {
        // Обрабатываем ошибку создания поста
        console.error('Ошибка при создании поста:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  });
});


// Функция для получения и отображения постов
async function getPosts() {
  try {
    const response = await fetch('http://localhost:3000/posts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (response.ok) {
      const posts = await response.json();
      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых постов
      for (const post of posts) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h2 class="post-title">${post.title}</h2>
          <p class="post-content">${post.content}</p>
          `;
          postsContainer.appendChild(postElement);
        }
      } else {
        // Обрабатываем ошибку получения постов
        console.error('Ошибка при получении постов:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  }
  
  getPosts(); // Вызов функции при загрузке страницы