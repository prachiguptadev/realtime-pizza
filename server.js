require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport = require("passport");
const PORT = process.env.PORT || 27017;

//Database connection
const url = "mongodb://127.0.0.1:27017/pizzas";
mongoose.connect("mongodb://127.0.0.1:27017/pizzas");
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
connection.on("error", console.error.bind(console, "Connecction error"));


app.use(session({ secret: "somevalue" }));


// session store
// let mongoStore = new MongoDbStore({
//   mongooseConnection:connection,
//   collection: "sessions"
// })

//session config

app.use(
  session({
    secret: url.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
      mongoUrl: url,
      collectionName: "sessions",
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
  })
);

// Passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
// app.use(session({ secret: "somevalue" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Assests
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// set template engine

app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
