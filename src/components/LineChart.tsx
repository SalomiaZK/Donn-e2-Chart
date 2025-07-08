import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function LineChart() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed'],
    datasets: [
      {
        label: 'Température',
        data: [22, 24, 19],
        borderColor: 'rgba(54, 162, 235, 0.6)',
        fill: false,
      },
    ],
  };
  return <Line data={data} />;
}
