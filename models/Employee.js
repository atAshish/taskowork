// clientCredentials.js

const sequelize = require("../config/config");
const { DataTypes, QueryTypes } = require("sequelize");
const dynamicModels = {};
const Client = sequelize.define("clients", {
  ClientID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CompanyID: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  CompanyName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ClientName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ClientEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ClientPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  Role: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

const Employee = sequelize.define("employee", {
  CompanyID: {
    type: DataTypes.STRING(50), // Assuming the same data type as CompanyID in your clients table
    references: {
      model: "clients", // Name of the clients table
      key: "CompanyID", // Name of the referenced column in the clients table
    },
    allowNull: false, // Ensure the CompanyID is not nullable
  },
  EmployeeID: {
    type: DataTypes.STRING, // Assuming the format should be a mixture of letters and numbers
    allowNull: false,
    unique: true,
  },
  EmployeeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EmployeeEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  EmployeeDepartment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  ReportsTo: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function createClientTable(CompanyName, CompanyID) {
  const Task = sequelize.define(`${CompanyName}_${CompanyID}_TaskTable`, {
    CompanyID: {
      type: DataTypes.STRING(50), // Assuming the same data type as CompanyID in your clients table
      references: {
        model: "clients", // Name of the clients table
        key: "CompanyID", // Name of the referenced column in the clients table
      },
      allowNull: false, // Ensure the CompanyID is not nullable
    },
    TaskID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TaskDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AssignedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AssignedTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EmployeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TaskAssignedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TaskCompletedDate: {
      // New field for TaskCompletedDate
      type: DataTypes.DATE,
      allowNull: true, // Allows NULL values by default
    },
    TaskPriority: {
      type: DataTypes.ENUM("High", "Medium", "Low"),
      allowNull: false,
      defaultValue: false,
    },
    TaskStatus: {
      type: DataTypes.ENUM("Active", "WIP", "Review", "Resolved"),
      allowNull: false,
      defaultValue: false,
    },
  });

  // Sync the new model with the database
  await Task.sync();
  return Task;
}
async function createDepartmentTable(CompanyName, CompanyID) {
  const Department = sequelize.define(
    `${CompanyName}_${CompanyID}_DepartmentTable`,
    {}
  );
}

module.exports = {
  Client,
  Employee,
  createClientTable,
  dynamicModels,
};
