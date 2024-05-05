// const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Employee, Client, createClientTable } = require("../models/Employee");
const { ClientsSignupService } = require("../services/Authservice");

const clientSignup = async (req, res) => {
  const Credentials = req.body;

  try {
    const newClient = await ClientsSignupService(Credentials);

    if (newClient) {
      try {
        await createClientTable(Credentials.CompanyName, newClient.CompanyID);

        return res.status(200).json({
          message: `${Credentials.ClientName} Registered Successfully`,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to create client table" });
      }
    }
  } catch (error) {
    console.log(error);
    if (error.message === "Company with this Name Already Exists") {
      return res.status(409).json({ message: error.message });
    } else if (error.message === "Client with this Email Already Exists") {
      return res.status(409).json({ message: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// const clientSignup = async (req, res) => {
//   console.log(req.body);
//   const { ClientName, ClientEmail, CompanyName, ClientPhone, Password } =
//     req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(Password, 10);
//     console.log("1");
//     const existingCompany = await Client.findOne({
//       where: {
//         CompanyName: CompanyName,
//       },
//     });
//     console.log("2");

//     if (existingCompany) {
//       return res
//         .status(409)
//         .json({ message: "Company with this Name Already Exists" });
//     }
//     console.log("3");

//     const existingClient = await Client.findOne({
//       where: {
//         ClientEmail: ClientEmail,
//       },
//     });
//     console.log("4");

//     if (existingClient) {
//       return res
//         .status(409)
//         .json({ message: "Client with this Email Already Exists" });
//     }
//     console.log("5");

//     const companyid = generateCompanyId(CompanyName);
//     console.log("6");

//     const newClient = await Client.create({
//       ClientName: ClientName,
//       CompanyID: companyid,
//       ClientEmail: ClientEmail,
//       CompanyName: CompanyName,
//       ClientPhone: ClientPhone,
//       Password: hashedPassword,
//       Role: "ADMIN",
//     });
//     console.log("7");
//     if (newClient) {
//       console.log("8");
//       try {
//         await createClientTable(CompanyName, companyid);

//         return res.status(200).json({
//           message: `${ClientName} Registered Successfully`,
//         });
//       } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: "Failed to create client table" });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const employeeLogin = async (req, res) => {
  const { EmployeeEmail, Password } = req.body;

  try {
    // Check if the employee exists
    const employee = await Employee.findOne({
      where: { EmployeeEmail: EmployeeEmail },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Validate password
    if (employee.Password !== Password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const existingClient = await Client.findOne({
      where: {
        CompanyID: employee.CompanyID,
      },
    });

    // Employee login successful
    const token = jwt.sign(
      {
        EmployeeID: employee.EmployeeID,
        CompanyID: employee.CompanyID,
        CompanyName: existingClient.CompanyName,
        EmployeeName: employee.EmployeeName,
        EmployeeEmail: employee.EmployeeEmail,
        EmployeeRole: employee.Role,
      },
      "YOUR_SECRET_KEY",
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({
      message: `${employee.EmployeeName} logged in successfully`,
      AccessToken: token,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const clientLogin = async (req, res) => {
  const { ClientEmail, Password } = req.body;
  try {
    // Check if the client exists
    const client = await Client.findOne({
      where: { ClientEmail: ClientEmail },
    });

    if (!client) {
      return res.status(404).json({ message: "Company not found" });
    }
    const isMatch = await bcrypt.compare(Password, client.Password);
    // Validate password
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Client login successful
    const token = jwt.sign(
      {
        ClientID: client.ClientID,
        CompanyID: client.CompanyID,
        CompanyName: client.CompanyName,

        ClientName: client.ClientName,
        ClientEmail: client.ClientEmail,
        ClientRole: client.Role,
      },
      "YOUR_SECRET_KEY",
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({
      message: `${client.ClientName} logged in successfully`,
      AccessToken: token,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  employeeLogin,
  clientLogin,
  clientSignup,
};
