import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

// Enregistrement des composants nécessaires pour un radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = () => {
  const data = {
    labels: ["Température", "Humidité", "Pression", "Vent", "Nuages"],
    datasets: [
      {
        label: "Données Météo - Paris",
        data: [32, 60, 1012, 15, 50],
        backgroundColor: "#09FBFF",
        borderColor: "#D403EL",
        borderWidth: 2,
        pointBackgroundColor: "#03CCFF"
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true
      }
    }
  };

  return (

    <div>
        <h2>Direction du vent</h2>
      <Radar className=" w-50" data={data} options={options} />
</div>

  )
};

export default RadarChart;
