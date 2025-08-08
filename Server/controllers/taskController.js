const Task = require("../models/Task");

// --- NEW: Controller to get tasks due today ---
module.exports.getTodaysTasks = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get the start and end of the current day
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const todaysTasks = await Task.find({
            user: userId,
            dueDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ priority: 1, createdAt: 1 }); // Optional: sort by priority or creation time

        res.json({
            success: true,
            message: "Tasks due today.",
            data: todaysTasks
        });

    } catch (err) {
        console.error("Error fetching today's tasks:", err);
        res.status(500).json({ success: false, message: "Server Error Occurred" });
    }
};

// GETS TASK STATISTICS
module.exports.getTaskStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const todoCount = Task.countDocuments({ user: userId, status: 'todo' });
        const inProgressCount = Task.countDocuments({ user: userId, status: 'in_Progress' });
        const doneCount = Task.countDocuments({ user: userId, status: 'done' });
        const [todo, in_Progress, done] = await Promise.all([todoCount, inProgressCount, doneCount]);
        const total = todo + in_Progress + done;
        res.json({
            success: true,
            data: { total, todo, in_Progress, done }
        });
    } catch (err) {
        console.error("Error in getTaskStats:", err);
        res.status(500).json({ success: false, message: "Server Error Occurred" });
    }
};

// GETS ALL TASKS FOR THE LOGGED-IN USER
module.exports.getTasks = async (req, res) => {
    try {
        const allTasks = await Task.find({ user: req.user.userId });
        res.json({
            success: true,
            message: "All Your tasks here...",
            data: allTasks
        });
    } catch (err) {
        console.error("Error in getTasks:", err);
        res.status(500).json({ success: false, message: "Server Error Occurred" });
    }
};

// CREATES AND ACTUALLY SAVES THE TASK
module.exports.createTask = async (req, res) => {
    try {
        let inProgress;
        if (req.body.status === "todo") {
            inProgress = 0;
        } else if (req.body.status === "in_Progress") {
            inProgress = 50;
        } else {
            inProgress = 100;
        }

        const newTask = new Task({
            ...req.body,
            inProgress,
            user: req.user.userId
        });

        const savedTask = await newTask.save();

        res.status(201).json({
            success: true,
            message: "Task created and saved successfully",
            data: savedTask
        });

    } catch (err) {
        console.error("!!! ERROR CREATING TASK !!!:", err);
        res.status(500).json({ success: false, message: "Failed to save task to database." });
    }
};

// SHOWS A SINGLE TASK
module.exports.showTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, message: "Your Task", data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// UPDATES A TASK
module.exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found or permission denied." });
        }
        res.json({ success: true, message: "Task updated successfully", data: updatedTask });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update task" });
    }
};

// UPDATES TASK PROGRESS
module.exports.updateTaskInProgress = async (req, res) => {
    try {
        if (req.body.status === "todo") req.body.inProgress = 0;
        else if (req.body.status === "in_Progress") req.body.inProgress = 50;
        else req.body.inProgress = 100;

        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, { ...req.body }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found or permission denied." });
        }
        res.status(200).json({ success: true, message: "Task Updated Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Task Updation Failed...!" });
    }
};

// DELETES A TASK
module.exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found or permission denied." });
        }
        res.status(200).json({ success: true, message: "Task Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Task Deletion Failed...!" });
    }
};