const {
  Employee,
  Client,
  dynamicModels,
  createClientTable,
} = require("../models/Employee");
const sequelize = require("../config/config");

const createTask = async (req, res) => {
  console.log(req.body);
  const {
    CompanyID,
    CompanyName,
    AssignedBy,
    AssignedTo,
    TaskDescription,
    Frequency,
  } = req.body;
  console.log(AssignedTo);
  let TaskModel;
  try {
    const company = await Client.findOne({
      attributes: ["CompanyName"],
      where: { CompanyID: CompanyID },
    });
    // Check if the company exists
    if (!company) {
      return res.status(404).json({ message: "Company does not exist" });
    }
    // Check if the employee exists
    const existingEmployee = await Employee.findOne({
      where: { EmployeeID: AssignedTo },
    });
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const tableName = `${CompanyName}_${CompanyID}_TaskTable`;
    try {
      TaskModel = await createClientTable(CompanyName, CompanyID);
    } catch (error) {
      console.log("Table already exists or error creating table");
      // Handle error or proceed to use the model if it exists
    }

    const newTask = await TaskModel.create({
      TaskDescription,
      CompanyID,
      AssignedBy,
      AssignedTo,
      EmployeeName: existingEmployee.EmployeeName,
      Frequency,
      TaskStatus: "active", // Assign provided TaskStatus or default to 'active'
    });

    if (newTask) {
      return res.status(201).json({ message: "Task created successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  const { CompanyID, CompanyName, TaskID } = req.body;
  console.log(req.body);
  console.log(CompanyID, CompanyName, TaskID);
  let TaskModel;
  try {
    // Check if the company exists
    const company = await Client.findOne({
      attributes: ["CompanyName"],
      where: { CompanyID: CompanyID },
    });

    if (!company) {
      return res.status(404).json({ message: "Company does not exist" });
    }

    try {
      TaskModel = await createClientTable(CompanyName, CompanyID);
    } catch (error) {
      console.log("Table already exists or error creating table");
      // Handle error or proceed to use the model if it exists
    }

    // Find the task to delete by TaskID
    const taskToDelete = await TaskModel.findByPk(TaskID);

    if (!taskToDelete) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete the task
    await taskToDelete.destroy();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const changeTaskStatus = async (req, res) => {
  const { CompanyID, CompanyName, TaskID, TaskStatus } = req.body;
  let TaskModel;
  try {
    // Check if the company exists
    const company = await Client.findOne({
      attributes: ["CompanyName"],
      where: { CompanyID: CompanyID },
    });

    if (!company) {
      return res.status(404).json({ message: "Company does not exist" });
    }
    try {
      TaskModel = await createClientTable(CompanyName, CompanyID);
    } catch (error) {
      console.log("Table already exists or error creating table");
    }

    const taskToUpdate = await TaskModel.findByPk(TaskID);
    if (!taskToUpdate) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Update the task status
    await taskToUpdate.update({ TaskStatus });

    return res
      .status(200)
      .json({ message: "Task status updated successfully" });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTasks = async (req, res) => {
  const { CompanyID, CompanyName, EmployeeID } = req.body;
  console.log(CompanyID, CompanyName);
  console.log(req.body);

  // Build query filters
  let TaskModel;
  try {
    // Check if the company exists
    const company = await Client.findOne({
      attributes: ["CompanyName"],
      where: { CompanyID: CompanyID },
    });

    if (!company) {
      return res.status(404).json({ message: "Company does not exist" });
    }
    try {
      TaskModel = await createClientTable(CompanyName, CompanyID);
    } catch (error) {
      console.log("Table already exists or error creating table");
    }

    // Get the task model dynamically

    // Find tasks based on filters
    // const tasks = await TaskModel.findAll({
    //   where: { CompanyID: CompanyID },
    // });
    let whereClause = { CompanyID: CompanyID };
    if (EmployeeID) {
      whereClause.AssignedTo = EmployeeID;
    }

    const tasks = await TaskModel.findAll({
      where: whereClause,
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createTask,
  deleteTask,
  changeTaskStatus,
  getTasks,
};
