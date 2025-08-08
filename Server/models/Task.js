const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"]
    },
    status: {
        type: String,
        enum: ["todo", "in_Progress", "done"]
    },
    dueDate: {
        type: Date,
        required: true,
    },
    tags: {
        type: String,
        required: true
    },
    inProgress: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    // --- THIS IS THE FINAL FIX ---
    // Add a field to store which user created the task
    user: {
        type: Schema.Types.ObjectId, // This stores a reference to a User's ID
        ref: 'User', // This links it to the 'User' model
        required: true
    },
    createdAt: { type: Date, default: Date.now },
});

const Task = model("Task", taskSchema);
module.exports = Task;