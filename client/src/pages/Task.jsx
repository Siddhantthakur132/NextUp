import TaskCard from '../components/TaskCard';
import axios from "axios";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import TaskModal from "../components/TaskModal";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { getToken } from "../utils/auth";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const Task = () => {
    const [columns, setColumns] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        const token = getToken();
        if (!token) {
            toast.error("Authentication error. Please log in again.");
            setIsLoading(false);
            return;
        }

        axios.get("/api/tasks/", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            const tasks = res.data.data;
            const newColumns = {
                'todo': { id: 'todo', title: 'To Do', tasks: tasks.filter(task => task.status === 'todo') },
                'in_Progress': { id: 'in_Progress', title: 'In Progress', tasks: tasks.filter(task => task.status === 'in_Progress') },
                'done': { id: 'done', title: 'Done', tasks: tasks.filter(task => task.status === 'done') },
            };
            setColumns(newColumns);
        })
        .catch((err) => {
            console.log(err);
            toast.error("Could not fetch tasks.");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const startColumn = columns[source.droppableId];
        const endColumn = columns[destination.droppableId];

        // First, update the UI optimistically
        const startTasks = Array.from(startColumn.tasks);
        const [removed] = startTasks.splice(source.index, 1);
        
        const newStartColumn = { ...startColumn, tasks: startTasks };
        
        let newEndColumn;
        if (startColumn === endColumn) {
            // Reordering in the same column
            const newTasks = startTasks;
            newTasks.splice(destination.index, 0, removed);
            newEndColumn = { ...startColumn, tasks: newTasks };
        } else {
            // Moving to a different column
            const endTasks = Array.from(endColumn.tasks);
            endTasks.splice(destination.index, 0, removed);
            newEndColumn = { ...endColumn, tasks: endTasks };
        }

        setColumns(prevColumns => ({
            ...prevColumns,
            [newStartColumn.id]: newStartColumn,
            [newEndColumn.id]: newEndColumn,
        }));

        // --- THIS IS THE FINAL FIX ---
        // Then, make the API call to update the backend
        if (startColumn !== endColumn) {
            const token = getToken();
            axios.patch(`/api/tasks/${draggableId}`, 
                { status: destination.droppableId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(res => {
                toast.success(`Task moved to "${endColumn.title}"!`);
            })
            .catch(err => {
                toast.error("Failed to update task status.");
                // If the API call fails, revert the UI change
                setColumns(columns);
            });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <AddIcon sx={{ fontSize: "20px" }} />
                    <span>Add Task</span>
                </button>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl text-gray-500">Loading tasks...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {Object.values(columns).map((column) => (
                            <Droppable key={column.id} droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`bg-gray-100 rounded-lg p-4 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4">{column.title}</h3>
                                        {column.tasks.map((task, index) => (
                                            <TaskCard key={task._id} task={task} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                )}
            </DragDropContext>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={() => {
                    setModalOpen(false);
                    fetchTasks();
                }}
            />
        </div>
    );
};

export default Task;