import './App.css';
import  { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Importez vos composants de graphique et de carte
import AreaChart from './components/AreaChart';
import Barchart from "./components/Barchart";
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import RadarChart from './components/RadarChart';
import LineChartPressure from './components/LineChartPressure';
import AreaChartHumidity from './components/AreaChartHumidity';
import Histogram from './components/WindSpeedHist';
import WeatherMap from './components/Leafleat';
// Supprimez l'importation de 'resolve' qui n'est pas utilisée et peut causer des problèmes
// import { resolve } from 'chart.js/helpers';


// --- ASSUREZ-VOUS QUE CES CHEMINS SONT CORRECTS POUR VOS FICHIERS CSV ---
// Placez vos CSV dans le dossier 'public/data/'
const FACT_FILE_PATH = '/data/fact_weather.csv';
const DIM_DATE_PATH = '/data/dim_date.csv';
const DIM_CITY_PATH = '/data/dim_ville.csv';
// ---------------------------------------------------------------------

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [availableCities, setAvailableCities] = useState([]); 

  const [allWeatherData, setAllWeatherData] = useState([]);
  const [filteredWeatherData, setFilteredWeatherData] = useState([]);
  const filters = { startDate, endDate, city: selectedCity };

  // Effet pour charger et joindre les données CSV une seule fois au montage
  useEffect(() => {
    const loadAndJoinData = async () => { // Renommé pour plus de clarté
      try {
        const parseCsv = (filePath) => {
          return new Promise((resolve, reject) => {
            Papa.parse(filePath, {
              download: true,
              header: true,
              dynamicTyping: true, // Tente de convertir les chaînes en nombres/booleans
              skipEmptyLines: true,
              complete: (results) => resolve(results.data),
              error: (error) => reject(error)
            });
          });
        };

        const [factDataRaw, dimDateRaw, dimCityRaw] = await Promise.all([
          parseCsv(FACT_FILE_PATH),
          parseCsv(DIM_DATE_PATH),
          parseCsv(DIM_CITY_PATH)
        ]);


          //ok
        console.log(dimCityRaw, 'dimCIty RAW');
        

        // --- Construction des Maps de dimension ---
        // Adaptez 'd.id_date' et 'c.id_city' si les noms de colonnes sont différents dans vos CSV de dimension
        const datesMap = new Map(dimDateRaw.map(d => [
          String(d.id_date), // Convertir en String pour s'assurer que les types correspondent à ceux de factData
          {
            // Adaptez 'd.date' au nom de la colonne de date complète dans dim_date.csv
            full_date: d.date ? new Date(d.date).toISOString().split('T')[0] : null,
            // Ajoutez d'autres propriétés de dim_date si nécessaire (ex: day_of_week, month, year)
          }
        ]));

        const citysMap = new Map(dimCityRaw.map(c => [
          String(c.id_ville), // Convertir en String
          {
            // Adaptez 'c.city' au nom de la colonne de nom de ville dans dim_city.csv
            city_name: c.city,
          }
        ]));

      
        console.log(dimCityRaw, 'DIM CITY RAW');
        

        console.log(citysMap, 'CITYS MAP');
        

          


        // --- Jointure des données ---
        const joinedData = factDataRaw.map(f => {
          // Adaptez 'f.id_date' et 'f.id_city' aux noms de colonnes réels dans fact_weather.csv
          const dateDim = datesMap.get(String(f.id_date)); // Convertir en String pour le lookup
          const cityDim = citysMap.get(String(f.id_ville)); // Convertir en String



          if (!dateDim || !cityDim) {
            console.warn("Donnée de fait sans dimension correspondante:", f);
            return null; // Retourne null pour les lignes sans correspondance
          }

          console.log('CITYYYYY DIIM', cityDim);
          

          // Construire l'objet de données jointes
          return {
            // Propriétés de la table de faits (adaptez les noms de colonnes de votre CSV de faits)
            temperature: typeof f.temperature_in_Celcius === 'number' ? f.temperature_in_Celcius : parseFloat(f.temperature_in_Celcius),
            humidity: typeof f.humidity === 'number' ? f.humidity : parseFloat(f.humidity),
            wind_speed: typeof f.wind_speed === 'number' ? f.wind_speed : parseFloat(f.wind_speed),
            pressure: typeof f.pressure === 'number' ? f.pressure : parseFloat(f.pressure),
            precipitation: typeof f.rain === 'number' ? f.rain : parseFloat(f.rain), 
            description: f.description,
            wind_direction: f.wind_direction,
            clouds: typeof f.clouds === 'number' ? f.clouds : parseFloat(f.clouds),
            rain: typeof f.rain === 'number' ? f.rain : parseFloat(f.rain),

            // Propriétés jointes des dimensions (utilisez les noms des propriétés de dateDim et cityDim)
            date: dateDim.full_date, // <--- CORRECTION ICI
            city: cityDim.city_name, // <--- CORRECTION ICI
        
          };
        }).filter(item => item !== null); // Filtrer les lignes qui n'ont pas trouvé de correspondance

        // // Filtrer les données jointes pour s'assurer de la validité
        // const validatedData = joinedData.filter(row =>
        //   row.date && !isNaN(row.latitude) && !isNaN(row.longitude) && row.city
        // );



        console.log("----joinedDATA----------",joinedData)

        setAllWeatherData(joinedData);
        setFilteredWeatherData(joinedData);

        // Extraire les villes uniques à partir des données jointes validées
        const uniqueCities = [...new Set(joinedData.map(item => item.city).filter(Boolean))];
        setAvailableCities(uniqueCities.sort());

        console.log(uniqueCities , "Unique CITY");
        


      } catch (error) {
        console.error("Erreur lors du chargement ou de la jointure des données CSV:", error);
      }
    };
    loadAndJoinData();





  }, []); // Cet effet s'exécute une seule fois au montage

  // Effet pour filtrer les données à chaque changement de filtre ou de données brutes
  useEffect(() => {
    if (allWeatherData.length === 0) {
      // console.log("allWeatherData est vide, pas de filtrage."); // Décommenter pour débogage
      return;
    }

    let currentFilteredData = allWeatherData;

    if (filters.startDate) {
      currentFilteredData = currentFilteredData.filter(item =>
        item.date && item.date >= filters.startDate
      );
    }
    if (filters.endDate) {
      currentFilteredData = currentFilteredData.filter(item =>
        item.date && item.date <= filters.endDate
      );
    }
    if (filters.city) {
      currentFilteredData = currentFilteredData.filter(item =>
        item.city && item.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    setFilteredWeatherData(currentFilteredData);
    console.log("Filtres appliqués, données filtrées:", currentFilteredData.length, "lignes");
  }, [filters, allWeatherData]); // Se déclenche quand 'filters' ou 'allWeatherData' changent

  const metrics = ["mean", "sum", "min", "max"];

  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 sm:p-8 lg:p-10 w-full">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-fuchsia-400 mb-10">
        Tableau de Bord Météo
      </h1>

      <div className="w-full mb-12 flex flex-wrap items-center justify-center gap-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-base font-medium text-gray-300 mb-1">Date de début:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-base font-medium text-gray-300 mb-1">Date de fin:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="citySelect" className="text-base font-medium text-gray-300 mb-1">Ville:</label>
          <select
            id="citySelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          >
            <option value="" className="bg-gray-700 text-gray-100">Toutes les villes</option>
            {availableCities.map((city) => (
              <option key={city} value={city} className="bg-gray-700 text-gray-100">{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-16">
        {metrics.map(m => (
          <div
            key={m}
            className="bg-amber-400 text-gray-800 text-lg font-semibold
                       w-32 h-14 flex items-center justify-center
                       rounded-full shadow-md hover:bg-amber-500 transition-colors duration-200"
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start lg:items-stretch gap-8 mb-16 h-[60vh] sm:h-[70vh] lg:h-[75vh] xl:h-[80vh]">
        <div className="w-full lg:w-1/3 xl:w-1/4 h-full bg-gray-800 text-gray-100 rounded-lg shadow-lg overflow-hidden p-4">
          <WeatherMap weatherData={filteredWeatherData} />
        </div>

        <div className="flex flex-col flex-grow justify-around w-full lg:w-2/3 xl:w-3/4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <Barchart data={filteredWeatherData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <PieChart data={filteredWeatherData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <AreaChartHumidity data={filteredWeatherData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center">
              <LineChart data={filteredWeatherData} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center h-70">
          <AreaChart data={filteredWeatherData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center h-70">
          <Histogram data={filteredWeatherData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center h-70">
          <RadarChart data={filteredWeatherData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md aspect-video flex items-center justify-center h-70">
          <LineChartPressure data={filteredWeatherData} />
        </div>
      </div>
    </div>
  );
}

export default App;