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

const Histogram = ({data}) => {
  

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
