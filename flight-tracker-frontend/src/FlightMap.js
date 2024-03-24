import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define custom icons for the departure and arrival markers
const airportIcon = new L.Icon({
  iconUrl: require('./Assests/landmark.png'), // Replace with path to your airport icon
  iconSize: [24, 24],
});
const flightIcon = new L.Icon({
  iconUrl: require('./Assests/plane-icon.png'), // Make sure the file exists in this path
  iconSize: [35, 35], // Adjust size as needed
});
const FlightMap = ({ flightPosition, flightNumber, departurePosition, arrivalPosition, pathCoordinates,departure,arrival }) => {
  return (
    <MapContainer center={flightPosition || departurePosition} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {flightPosition && (
        <Marker position={flightPosition} icon={flightIcon}>
          <Popup>
            <strong>Flight No:</strong> {flightNumber}<br/>
            <strong>Departure:</strong> {departure}<br/>
          <strong>Arrival:</strong> {arrival}
          </Popup>
        </Marker>
      )}
      {departurePosition && (
        <Marker position={departurePosition} icon={airportIcon}>
          <Popup>
            <strong>Departure Airport:</strong>{departure}<br/>
          </Popup>
        </Marker>
      )}
      {arrivalPosition && (
        <Marker position={arrivalPosition} icon={airportIcon}>
          <Popup>
            <strong>Arrival Airport:</strong>{arrival}
            

          </Popup>
        </Marker>
      )}
      {pathCoordinates && (
        <Polyline positions={pathCoordinates} color="blue" />
      )}
    </MapContainer>
  );
};

export default FlightMap;
