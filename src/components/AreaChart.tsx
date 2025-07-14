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

const AreaChart = ({data}) => {


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
    <div className='w-100'>
      <h2>Graphique en Aire de nuage</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AreaChart;
