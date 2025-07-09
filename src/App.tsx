import './App.css';
import React, { useState, useEffect } from 'react';

import AreaChart from './components/AreaChart';
import Barchart from "./components/Barchart";
import LineChart from './components/LineChart';
// import NavBar from './components/NavBar';
import PieChart from './components/PieChart';
import RadarChart from './components/RadarChart';
import LineChartPressure from './components/LineChartPressure';
import AreaChartHumidity from './components/AreaChartHumidity';
import Histogram from './components/WindSpeedHist';
import WeatherMap from './components/Leafleat';

function App() {
  const metrics = ["mean", "sum", "min", "max"];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = ["Paris", "Londres", "New York", "Tokyo", "Antananarivo"];

  const filters = {
    startDate,
    endDate,
    city: selectedCity
  };

  useEffect(() => {
    console.log("Filtres actuels:", filters);
    // Ici, vous déclencheriez le rechargement/filtrage des données pour vos graphiques
  }, [filters]);

  return (
    // Conteneur principal: fond sombre, texte clair, padding général
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      {/* <NavBar/> */}
      
      {/* Titre: couleur fuchsia adaptée au fond sombre, marge inférieure augmentée */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-fuchsia-400 mb-8">
        Tableau de Bord Météo
      </h1>

      {/* SECTION DES FILTRES - DÉPLACÉE ICI, APRÈS LE TITRE */}
      <div className="w-full mb-8 flex flex-wrap items-center justify-center gap-6 p-6 bg-gray-800 rounded-lg shadow-xl">
        {/* Date de début */}
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm font-medium text-gray-300 mb-1">Date de début:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>

        {/* Date de fin */}
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm font-medium text-gray-300 mb-1">Date de fin:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>

        {/* Sélecteur de ville */}
        <div className="flex flex-col">
          <label htmlFor="citySelect" className="text-sm font-medium text-gray-300 mb-1">Ville:</label>
          <select
            id="citySelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          >
            <option value="" className="bg-gray-700 text-gray-100">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-gray-700 text-gray-100">{city}</option>
            ))}
          </select>
        </div>
      </div> {/* FIN DE LA SECTION DES FILTRES */}

      {/* Metrics Display: fond plus clair pour le contraste, texte plus sombre, marge inférieure augmentée */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {metrics.map(m => (
          <div
            key={m}
            className="bg-amber-400 text-gray-800 text-base font-semibold
                       w-28 h-12 flex items-center justify-center
                       rounded-full shadow-md hover:bg-amber-500 transition-colors duration-200"
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </div>
        ))}
      </div>

      {/* Main Content Area: Map and Top Charts (Optimized for screen height) */}
      <div className="flex flex-col lg:flex-row justify-center items-start lg:items-stretch gap-6 mb-12
                      h-[60vh] sm:h-[70vh] lg:h-[75vh] xl:h-[80vh]">

        {/* Weather Map: fond sombre pour les cartes, padding interne augmenté */}
        <div className="w-full lg:w-1/3 xl:w-1/4 h-full bg-gray-800 text-gray-100 rounded-lg shadow-lg overflow-hidden p-3">
          <WeatherMap />
        </div>

        {/* Top Charts Column: chaque grille a une marge bottom pour séparer les rangées de graphes */}
        <div className="flex flex-col flex-grow justify-around w-full lg:w-2/3 xl:w-3/4 h-full">
          {/* Rangée 1 de graphes: gap entre graphes augmenté, marge bottom pour séparer de la rangée suivante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <Barchart filters={filters} />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <PieChart filters={filters} />
            </div>
          </div>

          {/* Rangée 2 de graphes: gap entre graphes augmenté */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <AreaChartHumidity filters={filters} />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <LineChart filters={filters} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts Section: chaque grille a une marge bottom pour séparer les rangées de graphes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
          <AreaChart filters={filters} />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
          <Histogram filters={filters} />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
          <RadarChart filters={filters} />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md aspect-video flex items-center justify-center">
          <LineChartPressure filters={filters} />
        </div>
      </div>
    </div>
  );
}

export default App;