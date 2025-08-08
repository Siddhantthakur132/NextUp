const express = require("express");
const router = express.Router();
const { getGoals, createGoal, deleteGoal } = require("../controllers/goalController");
const { authenticateUser } = require("../utils/middlewares");

// All goal routes are protected and require a logged-in user
router.use(authenticateUser);

// GET /api/goals - Get all goals
router.get("/", getGoals);

// POST /api/goals - Create a new goal
router.post("/", createGoal);

// DELETE /api/goals/:id - Delete a specific goal
router.delete("/:id", deleteGoal);

module.exports = router;