import React, { useEffect } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

// Register necessary components for a radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// The RadarChart component now receives the `data` prop (filteredWeatherData)
const RadarChart = ({ data }) => { // Change prop name from meteo_data to data for consistency
  // Initialize variables for chartData to empty arrays
  let labels = [];
  let datasets = [];

  // Define the metrics you want to show on the radar chart
  // Ensure these property names exist in your joinedData from App.jsx
  const metricsToShow = [
    { key: "temperature", label: "Température (°C)", color: "rgba(255, 99, 132, 0.6)" },
    { key: "humidity", label: "Humidité (%)", color: "rgba(54, 162, 235, 0.6)" },
    { key: "pressure", label: "Pression (hPa)", color: "rgba(255, 206, 86, 0.6)" },
    { key: "wind_speed", label: "Vitesse Vent (km/h)", color: "rgba(75, 192, 192, 0.6)" },
    { key: "clouds", label: "Nuages (%)", color: "rgba(153, 102, 255, 0.6)" },
    // Add other relevant metrics if you have them, e.g., precipitation, specific wind direction values
  ];

  // Process data only if it's valid and not empty
  if (data && data.length > 0) {
    // For a radar chart, it's common to show averages or specific points.
    // Let's calculate the average for each metric across the filtered data.
    // If you want to show a radar chart per city, you'd need to loop through unique cities.
    
    // Using the first item for labels is a good starting point for radar if you want a fixed set of metrics.
    // However, we define metricsToShow above for clarity and flexibility.
    labels = metricsToShow.map(m => m.label);

    // Aggregate data, e.g., calculate averages for the first city, or overall average
    // For simplicity, let's calculate overall averages of the filtered data
    const aggregatedValues = {};
    metricsToShow.forEach(metric => {
      const values = data
        .map(item => typeof item[metric.key] === 'number' ? item[metric.key] : parseFloat(item[metric.key]))
        .filter(val => !isNaN(val));
      
      aggregatedValues[metric.key] = values.length > 0 
        ? (values.reduce((sum, val) => sum + val, 0) / values.length) 
        : 0; // Default to 0 if no data
    });

    // Create a dataset for the aggregated data
    datasets = [
      {
        label: "Moyennes Météo des données filtrées", // This label will appear in the legend
        data: metricsToShow.map(metric => aggregatedValues[metric.key].toFixed(1)), // Format to 1 decimal
        backgroundColor: "rgba(9, 251, 255, 0.2)", // Light blue semi-transparent
        borderColor: "#09FBFF", // Light blue
        borderWidth: 2,
        pointBackgroundColor: "#03CCFF" // Bright blue points
      }
    ];

    // If you want to show a radar chart for each city in the filtered data, it would be more complex
    // and might require multiple datasets or a different component structure.
    // For this example, we show one aggregated radar.
    
  } else {
    // If no data, log a message
    console.log("RadarChart: No data to display.");
  }

  // Ensure chartData is always properly structured
  const chartData = {
    labels: labels,
    datasets: datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for responsive sizing
    plugins: {
      title: {
        display: true,
        text: 'Aperçu des Conditions Météo',
        color: '#e2e8f0', // Light text for dark background
      },
legend: {
  position: 'right', // <-- C'est ça qui bouge la légende à droite
  labels: {
    color: '#cbd5e1',
    boxWidth: 12,
    padding: 2,
  }
}
,
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            // Add unit based on the label, for example
            const metricKey = metricsToShow[context.dataIndex]?.key;
            let unit = '';
            if (metricKey === 'temperature') unit = '°C';
            else if (metricKey === 'humidity' || metricKey === 'clouds') unit = '%';
            else if (metricKey === 'pressure') unit = 'hPa';
            else if (metricKey === 'wind_speed') unit = 'km/h';
            
            if (context.parsed.r !== null) {
                label += context.parsed.r + unit;
            }
            return label;
          }
        }
      }
    },
    scales: {
      r: { // Radial axis
        beginAtZero: true,
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)' // Light grid lines
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)' // Light grid lines
        },
        pointLabels: {
          color: '#cbd5e1', // Light text for point labels (metrics)
        },
        ticks: {
          color: '#cbd5e1', // Light text for tick labels
          backdropColor: 'rgba(0, 0, 0, 0.5)', // Dark background for ticks
        }
      }
    }
  };

  // Optional: useEffect for logging or side effects
  useEffect(() => {
    // console.log("RadarChart received new data:", data);
  }, [data]);

  return (
    // Remove fixed width style and let Tailwind CSS handle sizing
      <Radar className="w-full h-full" data={chartData} options={options} />
  );
};

export default RadarChart;