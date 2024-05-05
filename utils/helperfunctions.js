const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
};

// const express = require('express');
// const router = express.Router();
// const verifyToken = require('./verifyToken'); // Import the verifyToken middleware

// router.get('/protected', verifyToken, (req, res) => {
//   // This route is protected and can only be accessed with a valid token
//   res.json({ message: 'Protected route', user: req.user });
// });

// module.exports = router;

module.exports = verifyToken;
