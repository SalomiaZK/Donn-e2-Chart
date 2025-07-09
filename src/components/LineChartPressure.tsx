import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function LineChartPressure() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed'],
    datasets: [
      {
        label: 'Pressure',
        data: [22, 24, 19],
        borderColor: 'rgba(54, 162, 235, 0.6)',
        fill: false,
      },
    ],
  };
  return (
    <div>
      <h2>Pressure</h2>
  <Line data={data} />
  </div>
);
}
