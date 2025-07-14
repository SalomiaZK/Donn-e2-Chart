import React, { useEffect } from 'react'; // Importez useEffect
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler, // Importez Filler pour les graphiques en aire
} from 'chart.js';

// Enregistrez les composants nécessaires de Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler // N'oubliez pas d'enregistrer Filler
);

// Le composant reçoit maintenant la prop `data` (qui sera filteredWeatherData)
const AreaChartHumidity = ({ data }) => {
  // Initialisez les variables pour chartData à des tableaux vides
  // pour éviter l'erreur "nextDatasets is undefined" si les données sont absentes
  let labels = [];
  let datasets = [];

  // Vérifiez si `data` est valide et contient des éléments
  if (data && data.length > 0) {
    // --- Logique de préparation des données pour l'humidité ---
    // Nous allons trier les données par date pour un affichage chronologique
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Extrait les dates uniques (labels de l'axe X)
    labels = sortedData.map(item => item.date);

    // Extrait les valeurs d'humidité
    const humidityValues = sortedData.map(item => typeof item.humidity === 'number' ? item.humidity : parseFloat(item.humidity)).filter(val => !isNaN(val));

    datasets = [
      {
        label: 'Humidité (%)', // Libellé pour la légende
        data: humidityValues,
        fill: true, // C'est ça qui transforme en area chart
        borderColor: '#3b82f6', // Bleu clair
        backgroundColor: 'rgba(59, 130, 246, 0.3)', // Bleu clair semi-transparent
        tension: 0.3, // Courbe de la ligne
      }
    ];
  } else {
    // Si aucune donnée, vous pouvez logguer pour le débogage
    console.log("AreaChartHumidity: Aucune donnée à afficher.");
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
        text: 'Tendance de l\'humidité au fil du temps',
        color: '#e2e8f0', // Texte clair pour fond sombre
      },
      legend: {
        labels: {
          color: '#cbd5e1', // Texte clair pour légendes
        }
      },
      tooltip: {
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += context.parsed.y + '%';
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
        beginAtZero: true,
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  // Optionnel: Utilisez useEffect si vous avez besoin de logs ou d'effets secondaires
  useEffect(() => {
    // console.log("AreaChartHumidity a reçu de nouvelles données:", data);
  }, [data]); // Se déclenchera chaque fois que la prop 'data' change

  return (
    // Supprimez le style en dur 'width: 600px' et laissez Tailwind CSS gérer la taille via le parent
    // Le composant devrait être flexible et s'adapter à son conteneur
    <div className="h-full w-full"> {/* Assurez-vous que le parent a une hauteur et largeur définies */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AreaChartHumidity;