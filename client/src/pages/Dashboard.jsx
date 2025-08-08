import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser, getToken } from '../utils/auth';
import UserInfo from '../components/UserInfo';
import InfoBox from '../components/InfoBox';
import PieChart from '../components/PieChart';
import { toast } from 'react-toastify';
import FocusTimer from '../components/FocusTimer';
import TodaysTasks from '../components/TodaysTasks'; // <-- 1. IMPORT THE NEW WIDGET

const TaskIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
);

const Dashboard = () => {
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]); // <-- 2. ADD NEW STATE FOR TODAY'S TASKS
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getToken();
        // --- 3. FETCH BOTH STATS AND TODAY'S TASKS AT THE SAME TIME ---
        const statsPromise = axios.get("/api/tasks/stats", { headers: { Authorization: `Bearer ${token}` } });
        const todayPromise = axios.get("/api/tasks/today", { headers: { Authorization: `Bearer ${token}` } });

        // Wait for both requests to complete
        const [statsResponse, todayResponse] = await Promise.all([statsPromise, todayPromise]);

        setStats(statsResponse.data.data);
        setTodaysTasks(todayResponse.data.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        toast.error("Could not load all dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-gray-500">Here's a snapshot of your productivity.</p>
        </div>
        <UserInfo />
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">Loading Dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Info Cards */}
          <InfoBox title="Total Tasks" value={stats?.total || 0} icon={<TaskIcon />} color="bg-blue-500" />
          <InfoBox title="Completed" value={stats?.done || 0} icon={<TaskIcon />} color="bg-green-500" />
          <InfoBox title="In Progress" value={stats?.in_Progress || 0} icon={<TaskIcon />} color="bg-yellow-500" />
          <InfoBox title="To-Do" value={stats?.todo || 0} icon={<TaskIcon />} color="bg-red-500" />

          {/* --- 4. ADD THE NEW WIDGET TO THE DASHBOARD --- */}
          <div className="md:col-span-2 lg:col-span-2">
             <TodaysTasks tasks={todaysTasks} />
          </div>

          {/* Focus Timer */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Focus Timer</h3>
            <div className="flex-grow flex items-center justify-center">
                <FocusTimer />
            </div>
          </div>
          
          {/* Pie Chart Card - Moved down to make space */}
          <div className="md:col-span-2 lg:col-span-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Task Status Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <PieChart chartData={stats} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;