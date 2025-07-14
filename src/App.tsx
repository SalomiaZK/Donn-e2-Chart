import './App.css';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

import AreaChart from './components/AreaChart';
import Barchart from "./components/Barchart";
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import RadarChart from './components/RadarChart';
import LineChartPressure from './components/LineChartPressure';
import AreaChartHumidity from './components/AreaChartHumidity';
import Histogram from './components/WindSpeedHist';
import WeatherMap from './components/Leafleat';

const FACT_FILE_PATH = '/data/fact_weather.csv';
const DIM_DATE_PATH = '/data/dim_date.csv';
const DIM_CITY_PATH = '/data/dim_ville.csv';

const CITY_COORDS_FALLBACK = {
  "Manaus": { latitude: -3.1190, longitude: -60.0217 },
  "Dubai": { latitude: 25.276987, longitude: 55.296249 },
  "Seattle": { latitude: 47.6062, longitude: -122.3321 },
  "Okinawa": { latitude: 26.2124, longitude: 127.6809 },
  "Denver": { latitude: 39.7392, longitude: -104.9903 },
  "Oslo": { latitude: 59.9139, longitude: 10.7522 },
};

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [allWeatherData, setAllWeatherData] = useState([]);
  const [filteredWeatherData, setFilteredWeatherData] = useState([]);

  const filters = { startDate, endDate, city: selectedCity };

  useEffect(() => {
    const loadAndJoinData = async () => {
      try {
        const parseCsv = (filePath) => new Promise((resolve, reject) => {
          Papa.parse(filePath, {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
          });
        });

        const [factDataRaw, dimDateRaw, dimCityRaw] = await Promise.all([
          parseCsv(FACT_FILE_PATH),
          parseCsv(DIM_DATE_PATH),
          parseCsv(DIM_CITY_PATH)
        ]);

        const datesMap = new Map(dimDateRaw.map(d => [
          String(d.id_date),
          { full_date: d.date ? new Date(d.date).toISOString().split('T')[0] : null }
        ]));

        const citysMap = new Map(dimCityRaw.map(c => [
          String(c.id_ville),
          {
            city_name: c.city,
            latitude: typeof c.latitude === 'number' ? c.latitude : parseFloat(c.latitude),
            longitude: typeof c.longitude === 'number' ? c.longitude : parseFloat(c.longitude),
          }
        ]));

        const joinedData = factDataRaw.map(f => {
          const dateDim = datesMap.get(String(f.id_date));
          let cityDim = citysMap.get(String(f.id_ville));

          if (!dateDim || !cityDim) return null;

          if ((isNaN(cityDim.latitude) || isNaN(cityDim.longitude)) && CITY_COORDS_FALLBACK[cityDim.city_name]) {
            cityDim = {
              ...cityDim,
              ...CITY_COORDS_FALLBACK[cityDim.city_name]
            };
          }

          if (isNaN(cityDim.latitude) || isNaN(cityDim.longitude)) return null;

          return {
            temperature: parseFloat(f.temperature_in_Celcius),
            humidity: parseFloat(f.humidity),
            wind_speed: parseFloat(f.wind_speed),
            pressure: parseFloat(f.pressure),
            precipitation: parseFloat(f.rain),
            description: f.description,
            wind_direction: f.wind_direction,
            clouds: parseFloat(f.clouds),
            rain: parseFloat(f.rain),
            date: dateDim.full_date,
            city: cityDim.city_name,
            latitude: cityDim.latitude,
            longitude: cityDim.longitude,
          };
        }).filter(item => item !== null);

        setAllWeatherData(joinedData);
        setFilteredWeatherData(joinedData);
        setAvailableCities([...new Set(joinedData.map(item => item.city).filter(Boolean))].sort());
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      }
    };

    loadAndJoinData();
  }, []);

  useEffect(() => {
    if (allWeatherData.length === 0) return;

    let currentFilteredData = allWeatherData;

    if (filters.startDate) {
      currentFilteredData = currentFilteredData.filter(item => item.date >= filters.startDate);
    }
    if (filters.endDate) {
      currentFilteredData = currentFilteredData.filter(item => item.date <= filters.endDate);
    }
    if (filters.city) {
      currentFilteredData = currentFilteredData.filter(item => item.city?.toLowerCase() === filters.city.toLowerCase());
    }

    setFilteredWeatherData(currentFilteredData);
  }, [filters, allWeatherData]);

  const metrics = ["mean", "sum", "min", "max"];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 sm:p-8 lg:p-10 max-w-full">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-fuchsia-400 mb-10">
        Tableau de Bord Météo
      </h1>

      <div className="w-full mb-12 flex flex-wrap items-center justify-center gap-10 p-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-gray-300 mb-1">Date de début :</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-700 text-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-gray-300 mb-1">Date de fin :</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-700 text-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="citySelect" className="text-gray-300 mb-1">Ville :</label>
          <select
            id="citySelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-3 border border-gray-600 rounded-md bg-gray-700 text-gray-100"
          >
            <option value="">Toutes les villes</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
              <div className="flex flex-wrap justify-center gap-4 w-full">
        {metrics.map(m => (
          <div
            key={m}
            className="bg-amber-400 text-gray-800 font-semibold px-6 py-3 rounded-full shadow hover:bg-amber-500 transition"
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </div>
        ))}
      </div>
      </div>



      <div className="flex flex-col lg:flex-row gap-6 mb-12 w-full">
        <div className="flex-1 min-w-[500px] max-w-sm bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4">
          <WeatherMap weatherData={filteredWeatherData} selectedCity={selectedCity} />
        </div>

        <div className="flex-[2] w-full flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
              <Barchart data={filteredWeatherData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
              <PieChart data={filteredWeatherData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
              <AreaChartHumidity data={filteredWeatherData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
              <LineChart data={filteredWeatherData} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10 ">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 w-full flex items-center justify-center">
          <AreaChart data={filteredWeatherData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 w-full flex items-center justify-center">
          <Histogram data={filteredWeatherData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 w-full flex items-center justify-center"> 
          <RadarChart data={filteredWeatherData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-64 w-full flex items-center justify-center">
          <LineChartPressure data={filteredWeatherData} />
        </div>
      </div>
    </div>
  );
}

export default App;
