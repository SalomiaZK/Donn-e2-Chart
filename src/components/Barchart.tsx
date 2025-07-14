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

export default function MyBarChart({data}) {
  return <Bar data={data} options={options} />;
}
