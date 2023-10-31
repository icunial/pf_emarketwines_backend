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
const User = require("./src/models/User");
const Favorite = require("./src/models/Favorite");
const Buy = require("./src/models/Buy");
const ReviewBuy = require("./src/models/ReviewBuy");
const Review = require("./src/models/Review");

// Models Relationships
Product.hasMany(Publication);
Publication.belongsTo(Product);

Varietal.hasMany(Product);
Product.belongsTo(Varietal);

User.hasMany(Publication);
Publication.belongsTo(User);

Publication.hasMany(Favorite);
Favorite.belongsTo(Publication);

User.hasMany(Favorite);
Favorite.belongsTo(User);

User.hasMany(Buy);
Buy.belongsTo(User);

Publication.hasMany(Buy);
Buy.belongsTo(Publication);

Buy.hasMany(ReviewBuy);
ReviewBuy.belongsTo(Buy);

User.hasMany(ReviewBuy);
ReviewBuy.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

Product.hasMany(Review);
Review.belongsTo(Product);

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
require("./src/config/passport")(passport);
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
/* db.sync({}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}); */

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
