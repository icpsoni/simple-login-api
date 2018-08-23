// Sign Up route: /user/register

const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");

// function to check file-type : Image
const checkFileType = require("../services/checkFileType");

// Express routing
const router = express.Router();

// Schema
const User = require("../models/user");

// Set Storage Engine
const storage = multer.diskStorage({
  destination: "./views/assets/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("image");

// GET request to user/register : Register Page
router.get("", (req, res) => {
  console.log("GET REGISTER");
  res.render("register");
});

// POST request to user/register : New User Registration
router.post("", (req, res) => {
  upload(req, res, err => {
    if (err) {
      //TODO: use res.redirect() instead of render
      return res.render("register", { msg: err });
    } else {
      if (
        !req.body.confirm_password ||
        req.body.confirm_password != req.body.password
      ) {
        res.json("password and confirm password doesn't match");
      }
      var data = {};
      data.name = req.body.name;
      data.email = req.body.email;
      data.password = bcrypt.hashSync(req.body.password, 10);
      data.profileImage = req.file.filename;

      var myData = new User(data);
      var validate = myData.joiValidate(data);
      if (validate.error) {
        return res.json(validate.error);
      }

      // Checking if User already exists
      User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
          throw err;
        } else if (existingUser) {
          if (req.accepts("html")) {
            return res.render("login", {
              msg: "User already exists please login"
            });
          } else {
            return res.json("User already exists");
          }
        } else {
          // Creating New User : Saving data to DB
          myData.save((err, data) => {
            if (err) {
              throw err;
            }
          });
        }
        if (req.accepts("html")) {
          return res.redirect("/user/login");
        } else {
          return res.json(data);
        }
      });
    }
  });
});

//Exporting router
module.exports = router;
