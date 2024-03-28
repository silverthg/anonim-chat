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
          // После успешной авторизации
          const text = await response.text();
          const data = JSON.parse(text);

          localStorage.setItem('accessToken', data.accessToken);
          // После успешной регистрации, аналогично
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
          const text = await response.text();
          const data = JSON.parse(text);
          // Установка токена в локальное хранилище
          localStorage.setItem('accessToken',  data.accessToken);
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
function addPost(title, content) {
  fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Токен из localStorage
    },
    body: JSON.stringify({ title, content })
  })
  .then(response => {
    if (response.ok) {
      getPosts(); // Обновляем отображение постов
    } else {
      throw new Error('Не удалось создать пост');
    }
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
}


// Обработчик отправки поста
document.addEventListener('DOMContentLoaded', () => {
  getPosts(); // Вызываем при загрузке страницы для отображения существующих постов

  const submitPostButton = document.getElementById('submit-post');

  submitPostButton.addEventListener('click', async () => { // Добавлен async
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    if (!title.trim() || !content.trim()) {
      alert('Заголовок и содержание поста не должны быть пустыми!');
      return;
    }
    try {
      await addPost(title, content); // Используем await для ожидания завершения запроса
      document.getElementById('post-title').value = '';
      document.getElementById('post-content').value = '';
      // Добавьте здесь пользовательское уведомление об успешном добавлении поста, если нужно
    } catch (error) {
      alert('Произошла ошибка при добавлении поста. Пожалуйста, попробуйте снова.');
      // Логирование для разработчика
      console.error('Ошибка при добавлении поста:', error);
    }
  });
});


// Функция для получения и отображения постов
async function getPosts() {
  try {
    const response = await fetch('http://localhost:3000/posts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Не удалось получить посты');
    }

    const posts = await response.json();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых постов

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <h2 class="post-title">${post.title}</h2>
        <p class="post-content">${post.content}</p>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Ошибка:', error);
  }
}


getPosts(); // Вызов функции при загрузке страницы