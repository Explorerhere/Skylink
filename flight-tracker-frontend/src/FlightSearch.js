import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, CircularProgress, Typography, Card, CardContent, Grid,Container } from '@mui/material';
import FlightMap from './FlightMap';
import { Search } from '@mui/icons-material'; // Import Search icon
import './FlightSearch.css';
import { Divider } from '@chakra-ui/react'
import Particles from 'react-tsparticles';
import { Flight, WatchLater,Speed } from '@mui/icons-material';
import database from './firebase-config';
import GaugeChart from 'react-gauge-chart'
const FlightSearch = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [addToWatchlistLoading, setAddToWatchlistLoading] = useState(false);
  const [watchlistResponse, setWatchlistResponse] = useState('');
  const [watchlist, setWatchlist] = useState([]);

  // States for departure and arrival coordinates and weather
  const [departureCoords, setDepartureCoords] = useState(null);
  const [arrivalCoords, setArrivalCoords] = useState(null);
  const [departureWeather, setDepartureWeather] = useState(null);
  const [arrivalWeather, setArrivalWeather] = useState(null);

  const maxSpeed = 1800; // Update this value if the maximum range of your gauge is different.
  const AVIATION_EDGE_API_KEY = '51e895-9bde28'; 
  const [airportNamesCache, setAirportNamesCache] = useState({});
  const [airlineNamesCache, setAirlineNamesCache] = useState({});
  const [routeDetailsCache, setRouteDetailsCache] = useState({});


// Your speed value obtained from the flight data. It should not be multiplied or altered.
let speedInKmH = flightData ? flightData.speed.horizontal:0; 
const fetchRouteDetails = async (departureIata, arrivalIata) => {
  const routeKey = `${departureIata}-${arrivalIata}`;
  
  // Return the details from cache if they exist
  if (routeDetailsCache[routeKey]) {
    return routeDetailsCache[routeKey];
  }
  
  try {
    const url = `https://aviation-edge.com/v2/public/routes?departureIata=${departureIata}&arrivalIata=${arrivalIata}&key=${AVIATION_EDGE_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const routeInfo = response.data[0];
      
      // Assume you're interested in departure and arrival times which might be part of the response
      const routeDetails = {
        departureTime: routeInfo.departureTime, // These are placeholder keys
        arrivalTime: routeInfo.arrivalTime,     // Replace with actual keys from the API response
      };

      // Update cache
      setRouteDetailsCache(prevCache => ({
        ...prevCache,
        [routeKey]: routeDetails
      }));
      
      return routeDetails;
    }
  } catch (error) {
    console.error('Failed to fetch route details:', error);
    return null; // Or a default object with the error message
  }
};
useEffect(() => {
  const fetchAndSetRouteDetails = async () => {
    if (flightData?.departure?.iataCode && flightData?.arrival?.iataCode) {
      const details = await fetchRouteDetails(flightData.departure.iataCode, flightData.arrival.iataCode);
      // Here you can decide how to store these details, maybe in the flightData or another state variable
    }
  };

  fetchAndSetRouteDetails();
}, [flightData?.departure?.iataCode, flightData?.arrival?.iataCode, routeDetailsCache]);

const fetchAirlineName = async (iataCode) => {
  // Return the name from cache if it exists
  if (airlineNamesCache[iataCode]) {
    return airlineNamesCache[iataCode];
  }

  try {
    const url = `https://aviation-edge.com/v2/public/airlineDatabase?codeIataAirline=${iataCode}&key=${AVIATION_EDGE_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      // Update cache
      setAirlineNamesCache(prevCache => ({
        ...prevCache,
        [iataCode]: response.data[0].nameAirline
      }));
      return response.data[0].nameAirline;
    }
  } catch (error) {
    console.error('Failed to fetch airline name:', error);
    return iataCode;
  }
};
useEffect(() => {
  const fetchAirlineFullName = async () => {
    if (flightData && flightData.airline && flightData.airline.iataCode) {
      const airlineIataCode = flightData.airline.iataCode;
      // Fetch airline name only if it's not in cache
      if (!airlineNamesCache[airlineIataCode]) {
        const airlineFullName = await fetchAirlineName(airlineIataCode);
        setFlightData(prevData => ({
          ...prevData,
          airline: { ...prevData.airline, fullName: airlineFullName },
        }));
      }
    }
  };

  fetchAirlineFullName();
}, [flightData, airlineNamesCache]);


const fetchAirportName = async (iataCode) => {
  // Return the name from cache if it exists
  if (airportNamesCache[iataCode]) {
    return airportNamesCache[iataCode];
  }
  
  try {
    const url = `https://aviation-edge.com/v2/public/airportDatabase?codeIataAirport=${iataCode}&key=${AVIATION_EDGE_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      // Update cache
      setAirportNamesCache(prevCache => ({
        ...prevCache,
        [iataCode]: response.data[0].nameAirport
      }));
      return response.data[0].nameAirport;
    }
  } catch (error) {
    console.error('Failed to fetch airport name:', error);
    return iataCode;
  }
};
// When flightData is updated, fetch full names for departure and arrival airports
useEffect(() => {
  const fetchFullNames = async () => {
    if (flightData) {
      const departureFullName = await fetchAirportName(flightData.departure.iataCode);
      const arrivalFullName = await fetchAirportName(flightData.arrival.iataCode);
      setFlightData((prevData) => ({
        ...prevData,
        departure: { ...prevData.departure, fullName: departureFullName },
        arrival: { ...prevData.arrival, fullName: arrivalFullName },
      }));
    }
  };
  fetchFullNames();
}, [flightData]);
 

   
  
 
  // Rest of your component..
  const fetchWeatherInfo = async (lat, lon) => {
    const OPENWEATHER_API_KEY = '884fa890888c064d849327f5393ba103'; // Move your API keys to environment variables
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const weatherData = response.data;
      return {
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
      };
    }
  } catch (error) {
    console.error('Failed to fetch weather info', error);
  }
  return null;
};
  const particlesOptions = {
    particles: {
      number: {
        value: 50,
      },
      size: {
        value: 3,
      },
    },
    interactivity: {
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
      },
    },
  };

  const fetchAirportCoordinates = async (iataCode) => {
    const apiKey = '51e895-9bde28'; // Ideally, use an environment variable for your API key
    const url = `https://aviation-edge.com/v2/public/airportDatabase?codeIataAirport=${iataCode}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const airportData = response.data[0]; // Assuming the first item is the airport data

      if (airportData) {
        return { lat: parseFloat(airportData.latitudeAirport), lng: parseFloat(airportData.longitudeAirport) };
      } else {
        console.error("No data found for the given IATA code.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching airport coordinates:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/searchFlight?flightNumber=${flightNumber}`);
      const data = response.data.length > 0 ? response.data[0] : null;
      if (data) {
        setFlightData(data);

        const departureData = await fetchAirportCoordinates(data.departure.iataCode);
        const arrivalData = await fetchAirportCoordinates(data.arrival.iataCode);

        if (departureData) {
          setDepartureCoords(departureData);
          const weatherData = await fetchWeatherInfo(departureData.lat, departureData.lng);
          setDepartureWeather(weatherData);
        }
        if (arrivalData) {
          setArrivalCoords(arrivalData);
          const weatherData = await fetchWeatherInfo(arrivalData.lat, arrivalData.lng);
          setArrivalWeather(weatherData);
        }
      } else {
        setError('No flight information found.');
      }
    } catch (err) {
      setError('Failed to fetch flight information.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  

   return (
      <Container maxWidth="lg">
        <Box sx={{
          flexGrow: 1,
          position: 'relative',
          marginTop: 3,
          padding: 3,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: 3
        }}>
          {/* Your Particles Component here */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
              Flight Search <Flight sx={{ verticalAlign: 'middle', fontSize: 'inherit' }} />
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
              <TextField
                label="Flight Number"
                variant="outlined"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: isLoading ? <CircularProgress size={24} /> : <WatchLater sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
                }}
              />
              <Button variant="contained" onClick={handleSearch} disabled={isLoading} startIcon={<Search />}>
                Search
              </Button>
            </Box>
           {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {flightData && departureWeather && arrivalWeather && (
            <Card sx={{ mt: 4 }}>
              <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
        Flight Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6"><strong>Flight Number:</strong> {flightData?.flight.iataNumber}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
    <Typography variant="h6" className="flightDetailHeader">
      Departure Airport:
    </Typography>
    <Typography variant="h6" className="flightDetailContent">{flightData?.departure.fullName || flightData?.departure.iataCode} ({flightData?.departure.icaoCode})
      {departureWeather && (
        <Box className="weatherInfo">
          <img
            src={`http://openweathermap.org/img/w/${departureWeather.icon}.png`}
            alt={departureWeather.description}
            className="weatherIcon"
          />
          <span>{departureWeather.temp}°C, {departureWeather.description}</span>
        </Box>
      )}
    </Typography>
  </Grid>
  <Grid item xs={12} sm={6} className="flightDetailSection">
    <Typography variant="h6" className="flightDetailHeader">
      Arrival Airport:
    </Typography>
    <Typography variant="h6" className="flightDetailContent">
      {flightData?.arrival.fullName || flightData?.arrival.iataCode} ({flightData?.arrival.icaoCode})
      {arrivalWeather && (
        <Box className="weatherInfo">
          <img
            src={`http://openweathermap.org/img/w/${arrivalWeather.icon}.png`}
            alt={arrivalWeather.description}
            className="weatherIcon"
          />
          <span>{arrivalWeather.temp}°C, {arrivalWeather.description}</span>
        </Box>
      )}
    </Typography>
  </Grid>


        <Grid item xs={12}>
          <Typography variant="h7" sx={{ color: flightData?.status === 'En Route' ? 'green' : 'red' }}>
            <strong>Status:</strong> {flightData?.status}
          </Typography>
        </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h7"><strong>Aircraft IATA Code:</strong> {flightData.aircraft.iataCode}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h7"><strong>Registration Number:</strong> {flightData.aircraft.regNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
  <Typography variant="h7">
    <strong>Airline:</strong> {flightData.airline.fullName }
  </Typography>
</Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h7"><strong>Airline iataCode:</strong> {flightData.airline.iataCode}</Typography>
              </Grid>
             
              <Grid item xs={12} sm={6}>
                <Typography variant="h7"><strong>Altitude:</strong> {flightData.geography.altitude} meters</Typography>
              </Grid>
              
            </Grid>
            <Grid item xs={12} sm={6}>
  <Typography variant="h7">
    <strong>Horizontal Speed:</strong>
    <Speed style={{ verticalAlign: 'bottom' }} /> {/* Adjust the styling as needed */}
    {flightData.speed.horizontal} km/h
  </Typography>
</Grid>
<Grid item xs={12} sm={6}>
  <Typography variant="h7">
    <strong>Departure Time:</strong> {routeDetailsCache[`${flightData.departure.iataCode}-${flightData.arrival.iataCode}`]?.departureTime}
  </Typography>
</Grid>
<Grid item xs={12} sm={6}>
  <Typography variant="h7">
    <strong>Arrival Time:</strong> {routeDetailsCache[`${flightData.departure.iataCode}-${flightData.arrival.iataCode}`]?.arrivalTime}
  </Typography>
</Grid>


              <FlightMap 
                flightPosition={flightData ? { lat: flightData.geography.latitude, lng: flightData.geography.longitude } : undefined}
                flightNumber={flightData ? flightData.flight.iataNumber : undefined}
                departure={flightData.departure.fullName || flightData.departure.iataCode}
              arrival={flightData.arrival.fullName || flightData.arrival.iataCode}
            
                departurePosition={departureCoords}
                arrivalPosition={arrivalCoords}
                // Path coordinates would be passed here if available
              />
             
            </CardContent>
          </Card>
        )}
      </Box>
      </Box>
    </Container>

  );
};

export default FlightSearch;