const express = require("express");
const taskController = require("../controllers/taskController")
const router = express.Router();
const { authenticateUser } = require("../utils/middlewares");

// Get all Tasks for the logged-in user
router.get("/", authenticateUser, taskController.getTasks);

// Get Task Statistics
router.get("/stats", authenticateUser, taskController.getTaskStats);

// --- NEW: Get tasks due today ---
router.get("/today", authenticateUser, taskController.getTodaysTasks);

// Get Task by ID
router.get("/:id", authenticateUser, taskController.showTask);

// Create Task
router.post("/", authenticateUser ,taskController.createTask);

// Update task
router.patch("/:id", authenticateUser, taskController.updateTask);

// Update Complete Task
router.put("/:id", authenticateUser, taskController.updateTaskInProgress);

router.delete("/:id", authenticateUser, taskController.deleteTask);

module.exports = router;