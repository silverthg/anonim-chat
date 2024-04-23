const express = require('express');
const path = require('path');
const app = express();

// Middleware for serving static files (CSS, JavaScript, images)
app.use(express.static(path.join(__dirname, '/')));

// Route for serving your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Set the port to listen on
const PORT = process.env.PORT || 3056;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

