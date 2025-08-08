const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const goalSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Goal = model("Goal", goalSchema);
module.exports = Goal;