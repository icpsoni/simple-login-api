// Middelware for protected routes

const authService = require("../services/auth");

function authMiddleware(req, res, next) {
  let token = req.headers.authorization || req.cookies.auth_token;
  authService.verifyJWTToken(token).then(
    data => {
      req._username = data.data.username;
      return next();
    },
    () => {
      res.redirect("/user/login");
    }
  );
}

// Exporting Middleware
module.exports = authMiddleware;
