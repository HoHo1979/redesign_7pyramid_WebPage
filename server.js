const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the 'deploy' directory
app.use(express.static(path.join(__dirname, 'deploy')));

// Handle 404 - Send to 404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'deploy', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
