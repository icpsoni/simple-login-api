// MAIN FILE

//requiring all required npm modules
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// To use express
const app = express();

//requiring all routes
const register = require("./routes/register");
const login = require("./routes/login");
const edit = require("./routes/edit");
const profile = require("./routes/profile");
const logout = require("./routes/logout");

//requiring JWT authentication middleware
const authMiddleware = require("./middlewares/authMiddleware");

// Setting View Engine as EJS
app.set("view engine", "ejs");

// Static folder
app.use(express.static("./views/assets"));

//Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use Cookie Parser
app.use(cookieParser());

//Defining routes
app.use("/user/login", login);
app.use("/user/register", register);
app.use("/user", authMiddleware, profile); //protected route so authMiddleware
app.use("/user/edit", authMiddleware, edit); //protected route
app.use("/user/logout", logout);

//Connecting to Database
mongoose.connect(
  "mongodb://chandraprakash:simpleasd123@ds125272.mlab.com:25272/simple-login-api",
  err => {
    if (err) {
      return console.log("mongo err", err);
    }
    console.log("Connected to Database simple-login-api");
  }
);

//Starting Server
var port = process.env.PORT || 5000;
app.listen(port, (err, res) => {
  if (err) throw err;
  console.log("Listening at port:", port);
});
