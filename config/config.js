const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const tedious = require("tedious");

dotenv.config();

const sequelize = new Sequelize(
  `${process.env.DATABASE}`,
  `${process.env.USER}`,
  `${process.env.PASSWORD}`,
  {
    host: `${process.env.SERVER}`,
    dialectModule: tedious,
    dialect: "mssql",
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
