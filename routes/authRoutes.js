const express = require("express");
const router = express.Router();
const {
  employeeLogin,
  clientLogin,
  clientSignup,
} = require("../controllers/AuthController");

// Define routes
router.post("/employee-login", employeeLogin);
router.post("/client-login", clientLogin);
router.post("/client-signup", clientSignup);

module.exports = router;
