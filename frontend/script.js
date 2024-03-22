const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const postsContainer = document.getElementById('posts-container');
const postText = document.getElementById('post-text');
const submitPost = document.getElementById('submit-post');

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
    window.location.href = 'main_page.html';
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
    window.location.href = 'main_page.html';
    console.log('Авторизация прошла успешно'); // Вывод успешного сообщения
  } else {
    // Ошибка авторизации
    // Обработать ошибку
    console.error('Ошибка авторизации:', response.statusText);
  }
});

// Main Page //
submitPost.addEventListener('click', async () => {
  const text = postText.value;
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (response.ok) {
    // Пост успешно создан
    // Очистить поле ввода
    postText.value = '';
    // Обновить ленту
    getPosts();
  } else {
    // Ошибка при создании поста
    // Обработать ошибку
    console.error('Ошибка при создании поста:', response.statusText);
  }
});

async function getPosts() {
  const response = await fetch('/api/posts');
  const posts = await response.json();

  postsContainer.innerHTML = '';

  for (const post of posts) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <p class="post-text">${post.text}</p>
      <p class="post-timestamp">${post.timestamp}</p>
    `;

    postsContainer.appendChild(postElement);
  }
}

getPosts();
