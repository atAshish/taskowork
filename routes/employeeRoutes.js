const express = require("express");
const router = express.Router();
const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
} = require("../controllers/employeeController");

router.post("/register-new-employee", addEmployee);
router.put("/update-employee/:EmployeeID", updateEmployee);
router.delete("/delete-employee/:EmployeeID", deleteEmployee);
router.post("/get-employees", getEmployees);

module.exports = router;
