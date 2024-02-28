'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  AttributionControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface Props {
  lat: number;
  lon: number;
}

export default function Map({lat, lon}: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={7}
      scrollWheelZoom={false}
      style={{height: '100%', width: '100%'}}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]} />
      <AttributionControl position="bottomright" prefix={false} />
    </MapContainer>
  );
}
