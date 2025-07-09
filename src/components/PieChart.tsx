import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const data = {
    labels: ['Chrome', 'Firefox', 'Edge'],
    datasets: [
      {
        label: 'Navigateurs',
        data: [65, 20, 15],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };
  return(
    <div>
        <h2>Description</h2>
  <Pie data={data} className='w-50' />
</div>
  ) 

}
