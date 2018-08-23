// Edit Profile route: /user/edit

const express = require("express");
const multer = require("multer");
const checkFileType = require("../services/checkFileType");
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

//GET request to /login/edit
router.get("/", (req, res) => {
  var username = req._username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
    res.render("edit", { user: data });
  });
});
console.log("In html");

//POST request to /login/edit
router.post("/", (req, res) => {
  upload(req, res, err => {
    if (err) {
      if (req.accepts("html")) {
        return res.render("register", { msg: err });
      } else if (req.accepts("json")) {
        res.json(err);
      }
    } else {
      // If there is any change in Name
      if (req.body.name) {
        User.findOneAndUpdate(
          { email: req._username },
          { $set: { name: req.body.name } },
          { new: true },
          (err, data) => {
            if (err) throw err;
            if (req.accepts("html")) {
              res.redirect("/user");
              return;
            } else if (req.accepts("json")) {
              res.json(data);
            }
          }
        );
      }
      // If there is any change in Profile Picture
      if (req.file) {
        User.findOneAndUpdate(
          { email: req._username },
          { $set: { profileImage: req.file.filename } },
          { new: true },
          (err, data) => {
            if (err) throw err;
            if (req.accepts("html")) {
              res.redirect("/user");
              return;
            } else if (req.accepts("json")) {
              res.json(data);
            }
          }
        );
      }
    }
  });
});

// Exporting router
module.exports = router;
