import React, { useEffect } from 'react'; // Don't forget to import useEffect
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title, // Import Title for axis titles
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components for a Bar Chart (including Title for axis labels)
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title, // Make sure Title is registered
  Tooltip,
  Legend
);

// The Histogram component receives the `data` prop (filteredWeatherData)
const Histogram = ({ data }) => {
  // Define bins for wind speed (e.g., in km/h or m/s, adjust as per your data's unit)
  // These are the upper limits of each bin.
  const windSpeedBins = [5, 10, 15, 20, 25, 30, 35, 40, 50]; // Example bins for wind speed in km/h

  let labels = [];
  let datasets = [];

  // Check if `data` is valid and contains elements
  if (data && data.length > 0) {
    // Initialize bin counts to zero
    const binCounts = new Array(windSpeedBins.length).fill(0);

    // Populate bin counts
    data.forEach(item => {
      const speed = typeof item.wind_speed === 'number' ? item.wind_speed : parseFloat(item.wind_speed);
      if (!isNaN(speed)) {
        for (let i = 0; i < windSpeedBins.length; i++) {
          if (speed <= windSpeedBins[i]) {
            binCounts[i]++;
            break; // Assign to the first bin it fits into and move to the next data item
          }
        }
      }
    });

    // Create labels for the bins
    labels = windSpeedBins.map((upperLimit, index) => {
      const lowerLimit = index === 0 ? 0 : windSpeedBins[index - 1];
      return `${lowerLimit}-${upperLimit} km/h`; // Adjust unit as needed
    });

    // Handle cases where the highest bin is the last
    if (labels.length > 0) {
        labels[labels.length -1] += '+'; // Mark the last bin as "and above"
    }


    datasets = [
      {
        label: 'Fréquence de la vitesse du vent',
        data: binCounts,
        backgroundColor: 'rgba(255, 159, 64, 0.7)', // Orange color for bars
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      }
    ];
  } else {
    // If no data, log a message for debugging
    console.log("Histogram (Wind Speed): Aucune donnée à afficher.");
  }

  // The chartData object is always properly structured
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
        text: 'Distribution de la Vitesse du Vent',
        color: '#e2e8f0', // Light text for dark background
      },
      legend: {
        display: true, // Display legend to show the label
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
              label += context.parsed.y + ' occurrences'; // Show number of occurrences
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Vitesse du Vent (km/h)', // Axis title for X-axis
          color: '#e2e8f0',
        },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Fréquence (Nombre de Mesures)', // Axis title for Y-axis
          color: '#e2e8f0',
        },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  // Optional: Use useEffect for logging or side effects when data changes
  useEffect(() => {
    // console.log("Histogram (Wind Speed) received new data:", data);
  }, [data]); // This effect will run whenever the 'data' prop changes

  return (
    // Ensure the parent div provides sufficient height and width, e.g., using Tailwind's h-full w-full
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Histogram;