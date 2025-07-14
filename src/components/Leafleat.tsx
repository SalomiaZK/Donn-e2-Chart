import React, { useEffect, useRef } from 'react'; // Importez useEffect et useRef
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icônes Leaflet dans React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Le composant WeatherMap reçoit maintenant la prop `weatherData`
const WeatherMap = ({ weatherData }) => {
  // Coordonnées de départ par défaut (centrée sur le monde ou une région si pas de données)
  const defaultPosition = [10, 0]; // Latitude, Longitude (ex: près de l'équateur, méridien de Greenwich)
  const defaultZoom = 2; // Niveau de zoom par défaut

  // Utilisez useRef pour accéder à l'instance de la carte Leaflet
  const mapRef = useRef();

  // Utilisez useEffect pour ajouter/supprimer les marqueurs lorsque weatherData change
  useEffect(() => {
    // S'assurer que la carte est chargée et que nous avons des données
    if (!mapRef.current || !weatherData) return;

    // --- Supprimer tous les marqueurs existants ---
    // C'est crucial pour éviter les duplications quand les données changent (filtrage)
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    // --- Préparer les données pour les marqueurs ---
    // Nous allons regrouper les données par ville/coordonnées pour éviter les marqueurs superposés
    const cityLocations = {};
    weatherData.forEach(item => {
      // Assurez-vous que votre 'joinedData' dans App.jsx a bien ces propriétés:
      // item.latitude, item.longitude, item.city, item.temperature, item.humidity, etc.
      if (item.latitude && item.longitude && item.city) {
        const key = `${item.latitude},${item.longitude}`; // Clé unique pour chaque emplacement
        if (!cityLocations[key]) {
          cityLocations[key] = {
            position: [item.latitude, item.longitude],
            city: item.city,
            dataPoints: [] // Pour stocker toutes les entrées de données pour cette ville
          };
        }
        cityLocations[key].dataPoints.push(item);
      }
    });

    // --- Ajouter les nouveaux marqueurs ---
    Object.values(cityLocations).forEach(({ position, city, dataPoints }) => {
      // Calculer des métriques agrégées pour la popup
      const temperatures = dataPoints.map(d => typeof d.temperature === 'number' ? d.temperature : parseFloat(d.temperature)).filter(temp => !isNaN(temp));
      const humidities = dataPoints.map(d => typeof d.humidity === 'number' ? d.humidity : parseFloat(d.humidity)).filter(hum => !isNaN(hum));

      let popupContent = `<strong>${city}</strong><br/>`;
      if (temperatures.length > 0) {
        const avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1);
        popupContent += `🌡 Temp. Moyenne: ${avgTemp}°C<br/>`;
      }
      if (humidities.length > 0) {
        const avgHum = (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1);
        popupContent += `💧 Humidité Moyenne: ${avgHum}%<br/>`;
      }
      // Ajoutez d'autres infos pertinentes de dataPoints si vous le souhaitez

      // Crée et ajoute le marqueur à l'instance de la carte
      L.marker(position)
        .addTo(mapRef.current)
        .bindPopup(popupContent);
    });

    // --- Centrer la carte sur les marqueurs s'il y en a ---
    if (Object.keys(cityLocations).length > 0) {
      // Calculer les limites pour inclure tous les marqueurs
      const bounds = L.latLngBounds(Object.values(cityLocations).map(loc => loc.position));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] }); // Ajoute un padding pour ne pas coller aux bords
    } else {
      // Si aucune donnée, revenir à la position par défaut
      mapRef.current.setView(defaultPosition, defaultZoom);
    }

  }, [weatherData]); // Re-exécuter cet effet chaque fois que `weatherData` change

  return (
    <MapContainer
      center={defaultPosition}
      zoom={defaultZoom}
      // Supprimez le style en dur 'height' et laissez Tailwind gérer la taille via le parent
      // Le composant devrait être flexible et s'adapter à son conteneur
      className="h-full w-full rounded-lg" // Assurez-vous que le parent a une hauteur et largeur définies
      ref={mapRef} // Attache la ref à MapContainer pour accéder à l'instance de la carte
      scrollWheelZoom={true} // Permet le zoom avec la molette de la souris
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Les marqueurs sont ajoutés dynamiquement via l'effet useEffect */}
    </MapContainer>
  );
};

export default WeatherMap;