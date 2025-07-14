import React, { useEffect } from 'react'; // Don't forget to import useEffect
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register all necessary components for a line chart
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// The LineChart component receives the `data` prop (filteredWeatherData)
export default function LineChart({ data }) {
  // Initialize labels and datasets to empty arrays to prevent errors
  let labels = [];
  let datasets = [];

  // Check if `data` is valid and contains elements before processing
  if (data && data.length > 0) {
    // --- Logic to prepare data for the line chart (e.g., Temperature over time) ---
    // Sort the data by date to ensure chronological order on the X-axis
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Extract unique dates for the X-axis labels
    labels = sortedData.map(item => item.date);

    // Extract temperature values
    // Ensure 'item.temperature' is the correct property name in your joined data
    const temperatureValues = sortedData
      .map(item => typeof item.temperature === 'number' ? item.temperature : parseFloat(item.temperature))
      .filter(val => !isNaN(val)); // Filter out any non-numeric values

    datasets = [
      {
        label: 'Température (°C)', // Label for this dataset in the legend
        data: temperatureValues,
        borderColor: '#84cc16', // A vibrant green color
        backgroundColor: 'rgba(132, 204, 22, 0.2)', // Light green fill under the line
        tension: 0.3, // Smoothness of the line
        fill: false, // This is a line chart, not an area chart
        pointRadius: 3, // Size of the data points
        pointHoverRadius: 5, // Size of data points on hover
      },
    ];
  } else {
    // If no data, log a message for debugging
    console.log("LineChart (Temperature): No data to display.");
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
        text: 'Température au fil du temps',
        color: '#e2e8f0', // Light text for dark background
      },
      legend: {
        labels: {
          color: '#cbd5e1', // Light text for legend labels
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '°C'; // Add units to the tooltip
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' }, // Color for X-axis tick labels
        grid: { color: 'rgba(255, 255, 255, 0.1)' } // Color for X-axis grid lines
      },
      y: {
        beginAtZero: false, // Temperature doesn't always start at zero
        ticks: { color: '#cbd5e1' }, // Color for Y-axis tick labels
        grid: { color: 'rgba(255, 255, 255, 0.1)' } // Color for Y-axis grid lines
      },
    },
  };

  // Optional: Use useEffect for logging or side effects when data changes
  useEffect(() => {
    // console.log("LineChart (Temperature) received new data:", data);
  }, [data]); // This effect will run whenever the 'data' prop changes

  return (
    // Ensure the parent div provides sufficient height and width, e.g., using Tailwind's h-full w-full
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}