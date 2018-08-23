// Profile route: /user/profile

const express = require("express");
const router = express.Router();

// Schema
const User = require("../models/user");

// USER PROFILE
router.get("/", (req, res) => {
  var username = req._username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
    if (req.accepts("html")) {
      return res.render("profile", { user: data });
    } else if (req.accepts("json")) {
      return res.json(data);
    }
  });
});

// Exporting router
module.exports = router;
