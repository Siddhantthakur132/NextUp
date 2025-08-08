import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';

// --- Icons for the Timer Controls ---
const PlayIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const ResetIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>;

const Time = () => {
    // --- State Management ---
    const timeSettings = {
        focus: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(timeSettings.focus);
    const [isActive, setIsActive] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState('');
    const intervalRef = useRef(null);

    // --- Fetch To-Do Tasks ---
    useEffect(() => {
        const fetchTodoTasks = async () => {
            try {
                const token = getToken();
                const res = await axios.get("/api/tasks/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Filter for tasks that are not yet done
                setTasks(res.data.data.filter(task => task.status !== 'done'));
            } catch (err) {
                toast.error("Could not load tasks for timer.");
            }
        };
        fetchTodoTasks();
    }, []);

    // --- Timer Logic ---
    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive]);

    useEffect(() => {
        if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Add a sound notification
            toast.success(mode === 'focus' ? "Focus session complete! Time for a break." : "Break's over! Time to focus.");
        }
    }, [timeLeft, mode]);

    const handleModeChange = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(timeSettings[newMode]);
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => setTimeLeft(timeSettings[mode]);

    // --- Helper Functions ---
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const totalDuration = timeSettings[mode];
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
    const strokeDashoffset = 565 * (1 - progress / 100); // Adjusted for a larger circle

    return (
        <div className="h-full w-full bg-gradient-to-br from-[#1f253a] to-[#2a324b] flex flex-col items-center justify-center p-4 text-white font-sans">
            <div className="w-full max-w-md mx-auto text-center">

                {/* Task Selector */}
                <div className="mb-8">
                    <select
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                        className="w-full bg-[#2a324b] border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select a task to focus on...</option>
                        {tasks.map(task => (
                            <option key={task._id} value={task._id}>{task.title}</option>
                        ))}
                    </select>
                </div>

                {/* Main Timer Component */}
                <div className="bg-[#2a324b] p-8 rounded-2xl shadow-2xl">
                    <div className="bg-[#1f253a] p-1.5 rounded-full flex items-center gap-2 mb-8">
                        <button onClick={() => handleModeChange('focus')} className={`w-full py-1.5 rounded-full text-sm font-semibold transition ${mode === 'focus' ? 'bg-[#5c67c7]' : 'hover:bg-[#2a324b]'}`}>Focus</button>
                        <button onClick={() => handleModeChange('shortBreak')} className={`w-full py-1.5 rounded-full text-sm font-semibold transition ${mode === 'shortBreak' ? 'bg-[#5c67c7]' : 'hover:bg-[#2a324b]'}`}>Short Break</button>
                        <button onClick={() => handleModeChange('longBreak')} className={`w-full py-1.5 rounded-full text-sm font-semibold transition ${mode === 'longBreak' ? 'bg-[#5c67c7]' : 'hover:bg-[#2a324b]'}`}>Long Break</button>
                    </div>

                    <div className="relative w-64 h-64 mx-auto mb-8">
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                            <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="90" cx="100" cy="100" />
                            <circle
                                className="text-[#8a92e8]"
                                strokeWidth="8"
                                strokeDasharray="565"
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="90"
                                cx="100"
                                cy="100"
                                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                            <span className="text-6xl font-bold tracking-wider">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-10">
                        <button onClick={resetTimer} className="text-gray-400 hover:text-white transition"><ResetIcon /></button>
                        <button onClick={toggleTimer} className="w-20 h-20 rounded-full bg-[#5c67c7] text-white shadow-lg flex items-center justify-center hover:bg-[#4a54a4] transition-colors">
                            {isActive ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        <div className="w-6"></div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 italic">"Don't take it seriously, take it personally."</p>
                    <p className="text-gray-500 text-sm mt-1">- Siddhant Thakur</p>
                </div>
            </div>
        </div>
    );
};

export default Time;