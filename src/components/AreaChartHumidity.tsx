// AreaChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const AreaChartHumidity = () => {
  const data = {
    labels: ['Jan', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Utilisateurs actifs',
        data: [100, 150, 125, 180, 160, 200],
        fill: true, // C’est ça qui transforme en area chart
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <h2>Graphique en Aire de Humidité</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AreaChartHumidity;
