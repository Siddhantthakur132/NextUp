import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../utils/auth';
import AddGoalModal from '../components/AddGoalModal'; // We will use the modal from before
import { Plus, Target } from 'lucide-react';

// A new component for displaying a single goal
const GoalItem = ({ goal, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center justify-between gap-4">
            <div className="flex-grow">
                <h3 className="font-bold text-gray-800">{goal.title}</h3>
                <p className="text-sm text-gray-500">{goal.description}</p>
            </div>
            <button onClick={() => onDelete(goal._id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                &times;
            </button>
        </div>
    );
};


const Goal = () => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchGoals = async () => {
        try {
            const token = getToken();
            const res = await axios.get("/api/goals", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGoals(res.data.data);
        } catch (err) {
            toast.error("Could not fetch your goals.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleAddGoal = async (newGoal) => {
        try {
            const token = getToken();
            const res = await axios.post("/api/goals", newGoal, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGoals([res.data.data, ...goals]); // Add new goal to the top of the list
            toast.success("Goal set successfully!");
        } catch (err) {
            toast.error("Failed to set new goal.");
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            const token = getToken();
            await axios.delete(`/api/goals/${goalId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGoals(goals.filter(goal => goal._id !== goalId)); // Remove goal from the list
            toast.info("Goal deleted.");
        } catch (err) {
            toast.error("Failed to delete goal.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Target size={28} className="text-blue-600" />
                        My Goals
                    </h1>
                    <p className="text-gray-500">Define your ambitions. Make them happen.</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Set New Goal</span>
                </button>
            </header>

            {/* Goals List */}
            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading your goals...</p>
                ) : goals.length > 0 ? (
                    goals.map((goal) => (
                        <GoalItem key={goal._id} goal={goal} onDelete={handleDeleteGoal} />
                    ))
                ) : (
                    <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-700">No Goals Yet</h3>
                        <p className="text-gray-500 mt-2">Click "Set New Goal" to define what you want to achieve.</p>
                    </div>
                )}
            </div>

            <AddGoalModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAddGoal}
            />
        </div>
    );
};

export default Goal;