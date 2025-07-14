import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({data}) {

  return(
    <div>
        <h2>Description</h2>
  <Pie data={data} className='w-50' />
</div>
  ) 

}
