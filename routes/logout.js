// Logout route : /user/logout

const express = require("express");
const router = express.Router();

//USER LOGOUT
router.get("/", (req, res) => {
  let token = req.headers.authorization || req.cookies.auth_token;
  res.clearCookie("auth_token", token);
  if (req.accepts("html")) {
    return res.redirect("/user/login");
  } else if (req.accepts("json")) {
    return res.json("Logged out");
  }
});

//Exporting router
module.exports = router;
