// WeatherMap.jsx
import React from 'react';
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

const cities = [
  { name: 'Paris', lat: 48.8566, lon: 2.3522, temp: 27 },
  { name: 'Antananarivo', lat: -18.8792, lon: 47.5079, temp: 22 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, temp: 30 },
  { name: 'Seattle', lat: 47.6062, lon: -122.3321, temp: 18 }
];

const WeatherMap = () => {
  return (
    <MapContainer
      center={[10, 0]}
      zoom={2}
      style={{ height: '350px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {cities.map((city, index) => (
        <Marker key={index} position={[city.lat, city.lon]}>
          <Popup>
            <strong>{city.name}</strong><br />
            🌡 Température : {city.temp}°C
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WeatherMap;
