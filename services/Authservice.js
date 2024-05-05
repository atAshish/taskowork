// const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Employee, Client, createClientTable } = require("../models/Employee");

const ClientsSignupService = async (Credentials) => {
  const { ClientName, ClientEmail, CompanyName, ClientPhone, Password } =
    Credentials;

  const hashedPassword = await bcrypt.hash(Password, 10);
  const existingCompany = await Client.findOne({
    where: {
      CompanyName: CompanyName,
    },
  });

  if (existingCompany) {
    throw new Error("Company with this Name Already Exists");
  }

  const existingClient = await Client.findOne({
    where: {
      ClientEmail: ClientEmail,
    },
  });

  if (existingClient) {
    throw new Error("Client with this Email Already Exists");
  }

  const companyid = generateCompanyId(CompanyName);

  const newClient = await Client.create({
    ClientName: ClientName,
    CompanyID: companyid,
    ClientEmail: ClientEmail,
    CompanyName: CompanyName,
    ClientPhone: ClientPhone,
    Password: hashedPassword,
    Role: "ADMIN",
  });
  return newClient;
};

function generateCompanyId(companyName) {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const companyId = companyName.toUpperCase() + "-" + randomDigits;
  return companyId;
}

module.exports = {
  ClientsSignupService,
};
