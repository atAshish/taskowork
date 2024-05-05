const express = require("express");
const app = express();
const cors = require("cors");
// const sellerRoutes = require("./routes/sellerRoutes");

// const User = require("./models/Users");
// const Seller = require("./models/Seller");
const { Employee, Client, Task } = require("./models/Employee");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const dotenv = require("dotenv");

app.use(cors());
dotenv.config();

//user model
// User.sync()
//   .then(() => {
//     console.log("User model synced");
//   })
//   .catch((error) => {
//     console.error("Error syncing User model:", error);
//   });

//seller model
// Seller.sync()
//   .then(() => {
//     console.log("Seller model synced");
//   })
//   .catch((error) => {
//     console.error("Error syncing Seller model:", error);
//   });

//client model
Client.sync()
  .then(() => {
    console.log("Client model synced");
  })
  .catch((error) => {
    console.error("Error syncing Client model:", error);
  });
Employee.sync()
  .then(() => {
    console.log("Employee model synced");
  })
  .catch((error) => {
    console.error("Error syncing Employee model:", error);
  });

// Resource.sync()
//   .then(() => {
//     console.log("Resource model synced");
//   })
//   .catch((error) => {
//     console.error("Error syncing Resource model:", error);
//   });

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World from Taskomaster!");
});
app.use("/api/employee", employeeRoutes);
// Connect the user routes
app.use("/api/authentication", authRoutes);
app.use("/api/taskmanagement", taskRoutes);
// app.use("/api/seller", sellerRoutes);
// app.use("/api/resource", resourceRoutes);

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Backend server is running!");
});
