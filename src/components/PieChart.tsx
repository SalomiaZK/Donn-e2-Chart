import React, { useEffect } from 'react'; // Don't forget to import useEffect
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for a Pie Chart
ChartJS.register(ArcElement, Tooltip, Legend);

// The PieChart component receives the `data` prop (filteredWeatherData)
export default function PieChart({ data }) {
  // Initialize labels and datasets to empty arrays to prevent errors
  let labels = [];
  let datasets = [];

  // Define a set of colors for your pie chart segments
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)', // Red
    'rgba(54, 162, 235, 0.7)', // Blue
    'rgba(255, 206, 86, 0.7)', // Yellow
    'rgba(75, 192, 192, 0.7)', // Green
    'rgba(153, 102, 255, 0.7)', // Purple
    'rgba(255, 159, 64, 0.7)', // Orange
    'rgba(199, 199, 199, 0.7)', // Gray
  ];
  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
  ];

  // Check if `data` is valid and contains elements before processing
  if (data && data.length > 0) {
    // --- Logic to count occurrences of each weather description ---
    const descriptionCounts = data.reduce((acc, item) => {
      // Ensure 'item.description' is the correct property name in your joined data
      const description = item.description ? item.description : 'Inconnu';
      acc[description] = (acc[description] || 0) + 1;
      return acc;
    }, {});

    labels = Object.keys(descriptionCounts);
    const counts = Object.values(descriptionCounts);

    datasets = [
      {
        label: 'Nombre d\'occurrences', // Label for tooltip
        data: counts,
        backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
        borderColor: labels.map((_, i) => borderColors[i % borderColors.length]),
        borderWidth: 1,
      },
    ];
  } else {
    // If no data, log a message for debugging
    console.log("PieChart (Description): Aucune donnée à afficher.");
  }

  // The chartData object is always properly structured, even if labels/datasets are empty
  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  // Chart options, adapted for dark mode and better readability
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Crucial for making the chart responsive within its parent div
    plugins: {
      title: {
        display: true,
        text: 'Répartition des Descriptions Météo',
        color: '#e2e8f0', // Light text for dark background
      },
      legend: {
        position: 'right', // Place legend on the right for better use of space
        labels: {
          color: '#cbd5e1', // Light text for legend labels
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Optional: Use useEffect for logging or side effects when data changes
  useEffect(() => {
    // console.log("PieChart (Description) received new data:", data);
  }, [data]); // This effect will run whenever the 'data' prop changes

  return (
    // Ensure the parent div provides sufficient height and width, e.g., using Tailwind's h-full w-full
    <div className="h-full w-full flex flex-col items-center justify-center"> {/* Use flexbox for centering content */}
      <h2>Répartition des Descriptions Météo</h2> {/* Moved title here, or use Chart.js title plugin */}
      <Pie data={chartData} options={options} className='w-full h-full' />
    </div>
  );
}