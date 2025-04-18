const JWT = require("jsonwebtoken");

// Middleware function to check for valid tokens
function tokenChecker(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");

  if (authHeader) {
    token = authHeader.slice(7);
  }

  JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.status(401).json({ message: "auth error" });
    } else if (!payload.user_id) {
      res.status(401).json({ message: "Token is missing user_id claim" });
    } else {
      // Add the user_id from the payload to the req object.
      req.user_id = payload.user_id;
      next();
    }
  });
}

module.exports = tokenChecker;
