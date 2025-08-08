import React, { useState, useEffect, useRef } from 'react';

// Icons for the buttons
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
const ResetIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L20.5 10"></path><path d="M20.49 15a9 9 0 0 1-14.85 3.36L3.5 14"></path></svg>;

const FocusTimer = () => {
    const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
    const BREAK_TIME = 5 * 60;  // 5 minutes in seconds

    const [mode, setMode] = useState('focus'); // 'focus' or 'break'
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive]);

    useEffect(() => {
        if (timeLeft === 0) {
            if (mode === 'focus') {
                setMode('break');
                setTimeLeft(BREAK_TIME);
                // You can add a notification here
            } else {
                setMode('focus');
                setTimeLeft(FOCUS_TIME);
                // You can add a notification here
            }
            setIsActive(false); // Pause timer when session ends
        }
    }, [timeLeft, mode]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };
    
    const totalDuration = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
    const strokeDashoffset = 283 * (1 - progress / 100);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            {/* Timer Display with Circular Progress */}
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle className="text-gray-200" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    {/* Progress circle */}
                    <circle
                        className={mode === 'focus' ? "text-blue-600" : "text-green-500"}
                        strokeWidth="7"
                        strokeDasharray="283"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</span>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{mode}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-6">
                <button onClick={resetTimer} className="text-gray-500 hover:text-gray-700 transition">
                    <ResetIcon />
                </button>
                <button onClick={toggleTimer} className={`w-16 h-16 rounded-full text-white shadow-lg transition flex items-center justify-center ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isActive ? <PauseIcon /> : <PlayIcon />}
                </button>
                 <div className="w-6"></div> {/* Spacer */}
            </div>
        </div>
    );
};

export default FocusTimer;