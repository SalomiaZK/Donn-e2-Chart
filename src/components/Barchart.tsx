// MyBarChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrement des composants
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Données
const data = {
  labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
  datasets: [
    {
      label: 'Fréquentation',
      data: [12, 19, 3, 5, 2],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

// Options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      enabled: true,
    },
  },
};

export default function MyBarChart() {
  return <Bar data={data} options={options} />;
}
