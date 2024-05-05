// controllers/clientCredentialsController.js
const { Employee, Client } = require("../models/Employee");
// const resourceDetails = require("../models/Resources");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { QueryTypes, sequelize } = require("sequelize");

const addEmployee = async (req, res) => {
  // console.log("request body", req.body);
  const { CompanyID, EmployeeName, EmployeeEmail, Password, Role } = req.body;
  console.log(CompanyID, EmployeeName, EmployeeEmail, Password, Role);
  try {
    const company = await Client.findOne({
      attributes: ["CompanyName"], // Select only the CompanyName column
      where: { CompanyID: CompanyID },
    });

    console.log(company);

    // Check if the company exists
    if (!company) {
      return res.status(404).json({ message: "Company does not exist" });
    }

    // Get the company name
    const companyName = company.CompanyName;
    console.log(companyName);

    const existingEmployee = await Employee.findOne({
      where: { EmployeeEmail: EmployeeEmail },
    });
    if (existingEmployee) {
      return res.status(409).json({ message: "Employee Already Exists" });
    }

    const employeeID = generateEmployeeID(companyName, EmployeeName);
    const newEmployee = await Employee.create({
      CompanyID,
      EmployeeID: employeeID,
      EmployeeName,
      EmployeeEmail,
      Password,
      Role,
    });

    if (newEmployee) {
      return res.status(200).json({
        message: `${EmployeeName} Registered Successfully`,
      });
    }
  } catch (error) {
    console.log(error, ".....eror");

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const { EmployeeID } = req.params;
  const { EmployeeName, EmployeeEmail, Password, Role } = req.body;
  // console.log(EmployeeID, EmployeeName, EmployeeEmail, Password, Role);

  try {
    // Check if the employee exists
    const existingEmployee = await Employee.findOne({
      where: { EmployeeID: EmployeeID },
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee's details
    existingEmployee.EmployeeName = EmployeeName;
    existingEmployee.EmployeeEmail = EmployeeEmail;
    existingEmployee.Password = Password;
    existingEmployee.Role = Role;

    await existingEmployee.save();

    return res.status(200).json({
      message: `${EmployeeName} Updated Successfully`,
      updatedEmployee: existingEmployee,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { EmployeeID } = req.params;
  const { CompanyID, EmployeeName } = req.body;

  try {
    // Check if the employee exists
    const existingEmployee = await Employee.findOne({
      where: { EmployeeID: EmployeeID },
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete the employee
    await existingEmployee.destroy();

    return res.status(200).json({
      message: `Employee with ID ${EmployeeID} deleted successfully`,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getEmployees = async (req, res) => {
  const { CompanyID } = req.body;
  console.log(CompanyID);

  try {
    const company = await Client.findOne({
      where: { CompanyID: CompanyID },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const companyName = company.CompanyName;
    console.log(companyName);
    // Find all employees belonging to the specified company
    const employees = await Employee.findAll({
      where: { CompanyID: CompanyID },
    });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: `No employees found for the specified company` });
    }

    return res.status(200).json({
      message: `Employees found for ${companyName}`,
      employees: employees,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const generateEmployeeID = (companyName, employeeName) => {
  try {
    // Extract the first three letters of the company name in uppercase
    const companyNameAbbreviation = companyName.slice(0, 3).toUpperCase();

    // Extract the first two letters of the employee name
    const employeeNameAbbreviation = employeeName.slice(0, 2).toUpperCase();

    // Generate a unique 4-digit random number
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    // Construct the employee ID by concatenating the abbreviations and the random number
    const employeeID = `${companyNameAbbreviation}-${employeeNameAbbreviation}${randomNumber}`;

    return employeeID;
  } catch (error) {
    console.error("Error generating employee ID:", error);
    throw error;
  }
};

module.exports = {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
};
