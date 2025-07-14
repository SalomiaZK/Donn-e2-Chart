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

const AreaChartHumidity = ({data}) => {

  

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
