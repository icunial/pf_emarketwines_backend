const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Body-Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialized Express Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
