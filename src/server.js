const express = require('express');
const app = express();
const port = 3000; // You can choose any available port

app.use(express.static(__dirname)); // Serve files from the current directory

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
