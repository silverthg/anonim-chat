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


// Функция для добавления нового поста в localStorage и обновления отображения
function addPost(title, content) {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]'); // Получаем текущие посты или инициализируем пустым массивом
  posts.push({ title, content }); // Добавляем новый пост
  localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем localStorage
  getPosts(); // Обновляем отображение постов
}


document.addEventListener("DOMContentLoaded", function() {
  var postsContainer = document.getElementById("posts-container");

  // Массив объектов постов с названиями и текстами
  var posts = [
      { title: "Пост 1", content: "Текст 1" },
      { title: "Пост 2", content: "Текст 2" },
      { title: "Пост 3", content: "Текст 3" },
      // Добавьте сколько угодно постов
  ];

  // Создание и добавление постов в контейнер
  posts.forEach(function(post) {
      var postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = "<h2>" + post.title + "</h2><p>" + post.content + "</p>";
      postsContainer.appendChild(postElement);
  });
});

// Обработчик отправки поста
document.addEventListener('DOMContentLoaded', () => {
  getPosts(); // Вызываем при загрузке страницы для отображения существующих постов

  const submitPostButton = document.getElementById('submit-post');

  submitPostButton.addEventListener('click', () => {
    const title = document.getElementById('post-title').value; // Считываем заголовок поста
    const content = document.getElementById('post-content').value; // Считываем содержание поста
    if (!title.trim() || !content.trim()) {
      alert('Заголовок и содержание поста не должны быть пустыми!');
      return;
    }
    addPost(title, content); // Добавляем пост и обновляем ленту
    // Очищаем поля ввода после добавления поста
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
  });
});


// Функция для получения и отображения постов
async function getPosts() {
  // Получаем посты или инициализируем пустым массивом
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
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
}

// async function getPosts() {
//   try {
//     const response = await fetch('http://localhost:3000/posts', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//       },
//     });

//     if (response.ok) {
//       // const posts = await response.json();
//       // const postsContainer = document.getElementById('posts-container');
//       const posts = JSON.parse(localStorage.getItem('posts') || '[]'); // Получаем посты или инициализируем пустым массивом
//       const postsContainer = document.getElementById('posts-container');
//       postsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых постов
//       for (const post of posts) {
//         const postElement = document.createElement('div');
//         postElement.classList.add('post');
//         postElement.innerHTML = `
//           <h2 class="post-title">${post.title}</h2>
//           <p class="post-content">${post.content}</p>
//           `;
//           postsContainer.appendChild(postElement);
//         }
//       } else {
//         // Обрабатываем ошибку получения постов
//         console.error('Ошибка при получении постов:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Ошибка при отправке запроса:', error);
//     }
//   }
  
  getPosts(); // Вызов функции при загрузке страницы