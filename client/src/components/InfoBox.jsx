import React from 'react';

const InfoBox = ({ title, value, icon, color }) => {
  return (
    // Main card container with shadow and rounded corners
    <div className="bg-white rounded-xl shadow-md flex items-center overflow-hidden hover:shadow-lg transition-shadow">
      
      {/* Colored Icon Section on the left */}
      <div className={`p-4 ${color}`}>
        {icon}
      </div>
      
      {/* Text Content Section on the right */}
      <div className="p-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>

    </div>
  );
};

export default InfoBox;