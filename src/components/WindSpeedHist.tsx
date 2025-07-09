// Histogram.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Histogram = () => {
  const data = {
    labels: ['0-10', '10-20', '20-30', '30-40', '40-50'],
    datasets: [
      {
        label: 'Nombre d\'occurrences',
        data: [2, 6, 9, 5, 3],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Plages de valeurs' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Fréquence' }
      }
    }
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <h2>Vitesse du vent</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Histogram;
