import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index }) => {
    // Determine priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-4 mb-3 rounded-lg shadow-md hover:shadow-lg transition-shadow ${snapshot.isDragging ? 'shadow-xl' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                    <div className="text-xs text-gray-400 mt-3">
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;