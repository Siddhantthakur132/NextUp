import React from 'react';

const TodaysTasks = ({ tasks }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Today's Agenda</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                {tasks && tasks.length > 0 ? (
                    <ul className="space-y-3">
                        {tasks.map(task => (
                            <li key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-800 font-medium">{task.title}</span>
                                <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={`Priority: ${task.priority}`}></span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No tasks due today. Enjoy your day!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodaysTasks;