import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Grid, CircularProgress, Card, CardContent, IconButton } from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SearchByRoute() {
  const [departureIata, setDepartureIata] = useState('');
  const [arrivalIata, setArrivalIata] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://aviation-edge.com/v2/public/routes?departureIata=${departureIata}&arrivalIata=${arrivalIata}&key=51e895-9bde28`);
      setRoutes(response.data);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const RegistrationNumbers = ({ registrationNumbers }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <Box>
        <Typography variant="body2">
          <strong>Registration Number:</strong> {expanded || registrationNumbers.length <= 2 ? 
            registrationNumbers.join(', ') : 
            `${registrationNumbers.slice(0, 2).join(', ')}...`}
        </Typography>
        {registrationNumbers.length > 2 && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Search by Route</Typography>
      <Box mb={4} display="flex" alignItems="center" flexWrap="wrap">
        <TextField
          label="Departure IATA Code"
          variant="outlined"
          value={departureIata}
          onChange={(e) => setDepartureIata(e.target.value.toUpperCase())}
          inputProps={{ maxLength: 3 }}
          sx={{ mr: 2, mb: 2 }}
        />
        <TextField
          label="Arrival IATA Code"
          variant="outlined"
          value={arrivalIata}
          onChange={(e) => setArrivalIata(e.target.value.toUpperCase())}
          inputProps={{ maxLength: 3 }}
          sx={{ mr: 2, mb: 2 }}
        />
        <Button onClick={handleSearch} variant="contained" disabled={loading} sx={{ mb: 2 }}>
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>
      {routes.length === 0 && !loading && (
        <Typography>No results found. Please try a different search.</Typography>
      )}
      <Grid container spacing={2}>
        {routes.map((route, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  <FlightTakeoffIcon /> Flight {route.flightNumber} <FlightLandIcon />
                </Typography>
                <Typography><strong>Departure:</strong> {route.departureIata} ({route.departureTime})</Typography>
                <Typography><strong>Arrival:</strong> {route.arrivalIata} ({route.arrivalTime})</Typography>
                <Typography><strong>Airline:</strong> {route.airlineIata}</Typography>
                <Typography><strong>ICAO:</strong> {route.airlineIcao}</Typography>
                <RegistrationNumbers registrationNumbers={route.regNumber || []} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SearchByRoute;
