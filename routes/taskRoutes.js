const express = require("express");
const router = express.Router();
const {
  createTask,
  deleteTask,
  getTasks,
  changeTaskStatus,
} = require("../controllers/TaskController");

router.post("/create-task", createTask);
router.post("/get-task", getTasks);
router.put("/change-status", changeTaskStatus);
router.post("/delete-task", deleteTask);

module.exports = router;
