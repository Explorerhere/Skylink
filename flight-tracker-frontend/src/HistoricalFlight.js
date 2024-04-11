import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Container,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';
import backgroundImage from './Assests/stenza.png'; // Ensure the path is correct
import { styled } from '@mui/material/styles'; // This line is necessary to use styled

const StyledCard = styled(Card)(({ theme }) => ({
  // Adjust these styles to match your design
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  color: 'white',
  margin: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const StyledContainer = styled(Box)({
  height: '100vh',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
});


const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#87CEEB',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#87CEEB',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#87CEEB',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#87CEEB',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(135, 206, 235, 0.8)',
  },
});

// Main component
const FlightHistory = () => {
  const [flights, setFlights] = useState([]);
  const [airportCode, setAirportCode] = useState('DEL');
  const [searchDate, setSearchDate] = useState('2023-03-28');

  const fetchData = async () => {
    try {
      const response = await axios.get('https://aviation-edge.com/v2/public/flightsHistory', {
        params: {
          key: 'f34fed-bff963', // Replace with your actual API key
          code: airportCode,
          type: 'departure',
          date_from: searchDate
        }
      });
      setFlights(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching flight data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    fetchData();
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'auto' }}>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -2,
          filter: 'blur(8px)',
        }}
      />
      <Container sx={{ zIndex: 1, position: 'relative', overflow: 'visible' }}>
        <Box p={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" gutterBottom component="div" sx={{ color: 'white', mt: 4, mb: 4 }}>
            Flight History <FlightTakeoffIcon />
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
            <StyledTextField
              label="Enter Airport Code"
              variant="outlined"
              value={airportCode}
              onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
            />
            <StyledTextField
              type="date"
              variant="outlined"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <StyledButton variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
              Search
            </StyledButton>
          </Box>
          <Grid container spacing={2}>
            {flights.length > 0 ? flights.map((flight, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledCard>
                  <CardContent>
                  <Typography variant="h6" component="div">
                    Flight {flight.flight.iataNumber}
                  </Typography>
                    {/* ...flight information... */}<Typography color="white">
                      {flight.departure.iataCode} → {flight.arrival.iataCode}
                    </Typography>
                    <Typography color="white" gutterBottom>
                      <EventNoteIcon fontSize="small" /> {searchDate}
                    </Typography>                
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Details</Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            )) : (
              <Typography color="white" sx={{ mt: 2, width: '100%' }} textAlign="center">
                No flights found for the specified airport and date.
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FlightHistory;
