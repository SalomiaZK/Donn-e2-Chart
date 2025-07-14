import React, { useEffect } from 'react'; // Importez useEffect
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrez les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Le composant reçoit la prop `data` (filteredWeatherData)
export default function LineChartPressure({ data }) {
  // Initialisez les variables pour chartData à des tableaux vides
  // pour éviter l'erreur "nextDatasets is undefined" si les données sont absentes
  let labels = [];
  let datasets = [];

  // Vérifiez si `data` est valide et contient des éléments
  if (data && data.length > 0) {
    // --- Logique de préparation des données pour la pression ---
    // Triez les données par date pour un affichage chronologique cohérent
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Extrait les dates uniques (labels de l'axe X)
    labels = sortedData.map(item => item.date);

    // Extrait les valeurs de pression
    // Assurez-vous que 'item.pressure' est le nom correct de votre colonne de données de pression
    const pressureValues = sortedData.map(item => typeof item.pressure === 'number' ? item.pressure : parseFloat(item.pressure)).filter(val => !isNaN(val));

    datasets = [
      {
        label: 'Pression Atmosphérique (hPa)', // Libellé pour la légende
        data: pressureValues,
        borderColor: '#facc15', // Couleur jaune/ambre pour la ligne
        backgroundColor: 'rgba(250, 204, 21, 0.2)', // Fond légèrement transparent
        tension: 0.4, // Courbe plus prononcée pour la ligne
        fill: false, // Pas un graphique en aire, juste une ligne
      },
    ];
  } else {
    // Si aucune donnée, vous pouvez logguer pour le débogage
    console.log("LineChartPressure: Aucune donnée à afficher.");
  }

  // L'objet chartData est toujours structuré correctement
  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  // Options du graphique (adaptées pour le mode sombre)
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important pour contrôler la taille via le parent div
    plugins: {
      title: {
        display: true,
        text: 'Tendance de la Pression Atmosphérique',
        color: '#e2e8f0', // Texte clair pour fond sombre
      },
      legend: {
        labels: {
          color: '#cbd5e1', // Texte clair pour légendes
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' hPa'; // Unité pour la pression
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        beginAtZero: false, // La pression ne commence pas nécessairement à zéro
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
    },
  };

  // Optionnel: Utilisez useEffect si vous avez besoin de logs ou d'effets secondaires
  useEffect(() => {
    // console.log("LineChartPressure a reçu de nouvelles données:", data);
  }, [data]); // Se déclenchera chaque fois que la prop 'data' change

  return (
    // Supprimez le div 'style' en dur et laissez Tailwind CSS gérer la taille via le parent
    <div className="h-full w-full"> {/* Assurez-vous que le parent a une hauteur et largeur définies */}
      <Line data={chartData} options={options} />
    </div>
  );
}