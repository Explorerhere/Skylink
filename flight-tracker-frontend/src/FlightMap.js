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

const FlightMap = ({ flightPosition, flightNumber, departurePosition, arrivalPosition, departure, arrival }) => {
  // If we have the flight position, create a path that includes the flight as a midpoint
  const pathCoordinates = flightPosition && departurePosition && arrivalPosition
    ? [departurePosition, flightPosition, arrivalPosition]
    : departurePosition && arrivalPosition
      ? [departurePosition, arrivalPosition]
      : [];

  return (
    <MapContainer center={flightPosition || departurePosition || { lat: 0, lng: 0 }} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {departurePosition && (
        <Marker position={departurePosition} icon={airportIcon}>
          <Popup>Departure Airport: {departure}</Popup>
        </Marker>
      )}
      {flightPosition && (
        <Marker position={flightPosition} icon={flightIcon}>
          <Popup>Flight No: {flightNumber} <br /> Departure: {departure} <br /> Arrival: {arrival}</Popup>
        </Marker>
      )}
      {arrivalPosition && (
        <Marker position={arrivalPosition} icon={airportIcon}>
          <Popup>Arrival Airport: {arrival}</Popup>
        </Marker>
      )}
      {pathCoordinates.length > 0 && (
        <Polyline positions={pathCoordinates} color="pink" />
      )}
    </MapContainer>
  );
};

export default FlightMap;
