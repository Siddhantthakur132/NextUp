import React from 'react';
import Chart from 'react-apexcharts';

const PieChart = ({ chartData }) => {
  // If there's no data yet, show a message or a loader
  if (!chartData || chartData.total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No task data to display.</p>
      </div>
    );
  }

  const options = {
    chart: {
      type: 'donut',
    },
    // The labels that will appear on the chart
    labels: ['To-Do', 'In Progress', 'Completed'],
    // The colors for each section
    colors: ['#ef4444', '#f59e0b', '#22c55e'], // Red, Yellow, Green
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Math.round(val)}%`, // Show percentage
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} tasks` // Show "X tasks" on hover
      }
    }
  };

  // The actual data for the chart series
  const series = [
    chartData.todo || 0,
    chartData.in_Progress || 0,
    chartData.done || 0
  ];

  return (
    // The Chart component from react-apexcharts
    <Chart
      options={options}
      series={series}
      type="donut"
      width="100%"
      height="100%"
    />
  );
}

export default PieChart;