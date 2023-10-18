const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./src/db");

const router = require("./src/routes/index");

const session = require("express-session");
const passport = require("passport");

// Database Models
const Publication = require("./src/models/Publication");
const Product = require("./src/models/Product");
const Varietal = require("./src/models/Varietal");

// Models Relationships
Product.hasMany(Publication);
Publication.belongsTo(Product);

Varietal.hasMany(Product);
Product.belongsTo(Varietal);

// Body-Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Res Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Router middleware
app.use("/", router);

// Error catching endware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).json({
    statusCode: status,
    msg: message,
  });
});

// Initialized Express Server
/* db.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}); */

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
