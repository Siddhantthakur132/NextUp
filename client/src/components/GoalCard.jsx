import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react'; // Using a popular icon library

const GoalCard = ({ goal, onDelete }) => {
    const isCompleted = goal.progress >= 100;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 flex flex-col">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800">{goal.title}</h3>
                <button onClick={() => onDelete(goal._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-4 flex-grow">{goal.description}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                    className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${goal.progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                <span>Progress</span>
                <span className={isCompleted ? 'text-green-600 font-bold' : 'text-blue-700'}>
                    {isCompleted ? <CheckCircle size={16} className="inline-block" /> : `${goal.progress}%`}
                </span>
            </div>
        </div>
    );
};

export default GoalCard;