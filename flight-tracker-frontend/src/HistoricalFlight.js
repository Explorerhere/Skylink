import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Container,
  IconButton
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';

const FlightHistory = () => {
  const [flights, setFlights] = useState([]);
  const [airportCode, setAirportCode] = useState('DEL');
  const [searchDate, setSearchDate] = useState('2023-03-28');

  const fetchData = async () => {
    try {
      const response = await axios.get('https://aviation-edge.com/v2/public/flightsHistory', {
        params: {
          key: '51e895-9bde28', // This should be replaced with your actual API key
          code: airportCode,
          type: 'departure',
          date_from: searchDate
        }
      });
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flight data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on initial render
  }, []);

  const handleSearch = () => {
    fetchData(); // Fetch data when the user initiates a search
  };

  return (
    <Container maxWidth="md">
      <Box p={4} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" gutterBottom component="div">
          Flight History <FlightTakeoffIcon />
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Enter Airport Code"
              variant="outlined"
              value={airportCode}
              onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {flights.length > 0 ? flights.map((flight, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    Flight {flight.flight.iataNumber}
                  </Typography>
                  <Typography color="textSecondary">
                    {flight.departure.iataCode} → {flight.arrival.iataCode}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    <EventNoteIcon fontSize="small" /> {searchDate}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View Details</Button>
                </CardActions>
              </Card>
            </Grid>
          )) : (
            <Typography sx={{ mt: 2 }}>No flights found for the specified airport and date.</Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default FlightHistory;
