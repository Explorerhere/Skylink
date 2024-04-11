import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography ,Box} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import backgroundImage from './Assests/stenza.png'; // Ensure the path is correct
import airportIconUrl from './Assests/landmark.png';
import L from 'leaflet';
// Define a theme for the application
const theme = {
  palette: {
    primary: '#005288', // A shade of blue for a professional, trustworthy feel
    secondary: '#f0f0f0', // Off-white for card backgrounds
    error: '#ff0033', // A brighter red for errors that need attention
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    header: {
      fontFamily: '"Montserrat", "Arial", sans-serif',
      fontSize: '1.5rem', // Larger for card headers to stand out
      fontWeight: 600, // Semi-bold for emphasis
      lineHeight: 1.4, // Optimal for readability
      color: '#333', // Dark grey for a strong contrast against the light background
    },
    body: {
      fontSize: '1rem', // Standard size for body text
      fontWeight: 400, // Regular weight for body text
      lineHeight: 1.6, // Increased line height for body text for better readability
      color: '#666', // Slightly lighter than header to differentiate the hierarchy
    },
  },
  shadows: {
    card: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow for cards
  },
  border: {
    radius: '8px', // Rounded corners for various elements
  },
};

function AirportSearch() {
  const [query, setQuery] = useState('');
  const [airportDetails, setAirportDetails] = useState(null);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const airportIcon = new L.Icon({
    iconUrl: airportIconUrl,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });
  const searchAirport = async () => {
    setError('');
    setAirportDetails(null);
    try {
      const response = await fetch(`http://localhost:5000/searchAirport?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAirportDetails(data);
    } catch (err) {
      setError('Failed to fetch airport information: ' + err.message);
    }
  };
  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      }, () => {
        setError('Geolocation is not supported by this browser.');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };
  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
    <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          filter: 'blur(8px)',
          WebkitFilter: 'blur(8px)',
        }}
      />
    <div style={{ padding: '20px',color:'white' }}>
    <TextField
  label="Search by Airport or Location"
  variant="outlined"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  fullWidth
  style={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px',backdropFilter: 'blur(5px)' }} // assuming you want 80% opacity
/>

      <Button variant="contained" color="primary" onClick={searchAirport} style={{ marginTop: '10px' }}>
        Search
      </Button>
      {error && <Typography style={{ marginTop: '10px', color: theme.palette.error }}>{error}</Typography>}
      {airportDetails && (
        <>
          <Card variant="outlined" style={{ marginTop: '20px', backgroundColor: theme.palette.secondary, borderRadius: theme.border.radius, boxShadow: theme.shadows.card }}>
            <CardContent>
              <Typography style={{ ...theme.typography.header }}>{airportDetails.name} ({airportDetails.code})</Typography>
              <Typography style={{ ...theme.typography.body }}>City: {airportDetails.city || 'N/A'}</Typography>
              <Typography style={{ ...theme.typography.body }}>Country ID: {airportDetails.country_id}</Typography>
              <Typography style={{ ...theme.typography.body }}>Time Zone: {airportDetails.time_zone_id}</Typography>
              <Typography style={{ ...theme.typography.body }}>Elevation: {airportDetails.elevation}m</Typography>
              <Typography style={{ ...theme.typography.body }}>ICAO: {airportDetails.icao || 'N/A'}</Typography>
              <Typography style={{ ...theme.typography.body }}>URL: <a href={airportDetails.url} target="_blank" rel="noopener noreferrer">{airportDetails.url || 'N/A'}</a></Typography>
              <Typography style={{ ...theme.typography.body }}>Location: Latitude {airportDetails.location.coordinates[1]}, Longitude {airportDetails.location.coordinates[0]}</Typography>
          <Button variant="contained" color="secondary" style={{ marginTop: '10px' }} onClick={fetchUserLocation}>
            Navigate to Airport
          </Button>
          {userLocation && (
            <a href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${airportDetails.location.coordinates[1]},${airportDetails.location.coordinates[0]}&travelmode=driving`} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          )}
                        </CardContent>
                    </Card>
                    <div id="mapid" style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                        <MapContainer center={[airportDetails.location.coordinates[1], airportDetails.location.coordinates[0]]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker
  position={[airportDetails.location.coordinates[1], airportDetails.location.coordinates[0]]}
  icon={airportIcon}
>
  <Popup>
    {airportDetails.name} ({airportDetails.code})<br />
    {airportDetails.city}, {airportDetails.country_id}<br />
    Elevation: {airportDetails.elevation}m
  </Popup>
</Marker>
                        </MapContainer>
                    </div>
                </>
            )}
        </div>
        </Box>
    );
}

export default AirportSearch;
