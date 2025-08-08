const Goal = require("../models/Goal");

// Get all goals for the logged-in user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: goals });
    } catch (err) {
        console.error("Error fetching goals:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create a new goal
exports.createGoal = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newGoal = new Goal({
            title,
            description,
            user: req.user.userId,
        });
        const savedGoal = await newGoal.save();
        res.status(201).json({ success: true, data: savedGoal });
    } catch (err) {
        console.error("Error creating goal:", err);
        res.status(500).json({ success: false, message: "Failed to create goal" });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!goal) {
            return res.status(404).json({ success: false, message: "Goal not found or permission denied." });
        }
        res.json({ success: true, message: "Goal deleted successfully" });
    } catch (err) {
        console.error("Error deleting goal:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};