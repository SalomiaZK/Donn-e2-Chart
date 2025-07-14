import React, { useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Enregistrez les composants nécessaires de Chart.js (c'est déjà fait, mais assurez-vous que toutes les dépendances sont là)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Votre composant Barchart reçoit la prop `data` (filteredWeatherData)
const Barchart = ({ data }) => {
  // Initialisez les variables qui construiront chartData
  // Elles doivent toujours être des tableaux, même vides, pour éviter l'erreur.
  let labels = [];
  let datasets = [];

  // Vérifiez si 'data' est valide et contient des éléments avant de le traiter
  if (data && data.length > 0) {
    // --- Votre logique de préparation des données ici ---
    // Cette logique dépend de ce que vous voulez afficher dans ce graphique.
    // Par exemple, calculons la température moyenne par ville.

    const aggregatedData = data.reduce((acc, item) => {
      // Assurez-vous que 'item.city' et 'item.temperature' sont bien les noms de vos colonnes dans les données jointes
      if (item.city && typeof item.temperature === 'number') {
        if (!acc[item.city]) {
          acc[item.city] = { sumTemp: 0, count: 0 };
        }
        acc[item.city].sumTemp += item.temperature;
        acc[item.city].count += 1;
      }
      return acc;
    }, {});

    labels = Object.keys(aggregatedData);
    const avgTemperatures = labels.map(city =>
      (aggregatedData[city].sumTemp / aggregatedData[city].count).toFixed(1)
    );

    datasets = [
      {
        label: 'Température Moyenne (°C)', // Libellé de votre série de données
        data: avgTemperatures,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      // Vous pouvez ajouter d'autres datasets ici si besoin
    ];
  } else {
    // Si 'data' est vide ou null, vous pouvez laisser 'labels' et 'datasets' vides,
    // ou ajouter un dataset vide avec un message "Pas de données".
    console.log("Barchart: Aucune donnée à afficher.");
  }

  // L'objet chartData est toujours structuré correctement,
  // même si 'labels' et 'datasets' sont des tableaux vides.
  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  // Options du graphique (adaptées pour le mode sombre)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Température Moyenne par Ville',
        color: '#e2e8f0', // Texte clair pour fond sombre
      },
      legend: {
        labels: {
          color: '#cbd5e1', // Texte clair pour légendes
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#cbd5e1', // Couleur des labels d'axe X
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Couleur de la grille d'axe X
        }
      },
      y: {
        ticks: {
          color: '#cbd5e1', // Couleur des labels d'axe Y
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Couleur de la grille d'axe Y
        }
      }
    }
  };

  // Utilisez useEffect si des effets secondaires ou des logs sont nécessaires
  useEffect(() => {
    // Ce useEffect se déclenchera chaque fois que la prop `data` change.
    // Chart.js mettra à jour le graphique automatiquement via la prop `data` de <Bar/>.
    // console.log("Barchart a reçu de nouvelles données:", data);
  }, [data]); // Le graphique se mettra à jour lorsque 'data' change

  return (
    <Bar data={chartData} options={options} />
  );
};

export default Barchart;