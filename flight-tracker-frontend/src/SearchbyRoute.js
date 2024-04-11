import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import backgroundImage from './Assests/stenza.png'; // Ensure the path is correct
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  color: 'white',
}));

const SearchArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2, 0),
}));

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#87CEEB',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#87CEEB',
    },
    '&:hover fieldset': {
      borderColor: '#87CEEB',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#87CEEB',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: '#87CEEB',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(135, 206, 235, 0.8)',
  },
}));

// Main component function
function SearchByRoute() {
  const [departureIata, setDepartureIata] = useState('');
  const [arrivalIata, setArrivalIata] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://aviation-edge.com/v2/public/routes`, {
        params: {
          departureIata: departureIata,
          arrivalIata: arrivalIata,
          key: 'f34fed-bff963', // Replace with your actual API key
        },
      });
      setRoutes(response.data);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  // RegistrationNumbers component
  const RegistrationNumbers = ({ registrationNumbers }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <Box>
        <Typography variant="body2" color="white">
          <strong>Registration Number:</strong>
          {expanded || registrationNumbers.length <= 2 ? 
            registrationNumbers.join(', ') : 
            `${registrationNumbers.slice(0, 2).join(', ')}...`}
        </Typography>
        {registrationNumbers.length > 2 && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)} style={{ color: 'white' }}>
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>
    );
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
      <SearchArea>
  <Typography variant="h4" component="div" sx={{ color: 'skyblue', marginBottom: 0, marginRight: 10,fontWeight: 'bold', }}>
    Search by Route
  </Typography>
  <StyledTextField
    label="Departure IATA Code"
    variant="outlined"
    value={departureIata}
    onChange={(e) => setDepartureIata(e.target.value.toUpperCase())}
    inputProps={{ maxLength: 3 }}
    sx={{ marginRight: 2 }}
  />
  <StyledTextField
    label="Arrival IATA Code"
    variant="outlined"
    value={arrivalIata}
    onChange={(e) => setArrivalIata(e.target.value.toUpperCase())}
    inputProps={{ maxLength: 3 }}
    sx={{ marginRight: 2 }}
  />
  <StyledButton onClick={handleSearch} disabled={loading} startIcon={loading ? <CircularProgress size={24} /> : null}>
    Search
  </StyledButton>
</SearchArea>
      {routes.length === 0 && !loading && (
        <Typography variant="body1" color="white" align="center" mt={2}>
         Please Enter Airport Codes.
        </Typography>
      )}
      <Grid container spacing={2}>
        {routes.map((route, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <FlightTakeoffIcon style={{ verticalAlign: 'middle', color: '#87CEEB' }} />
                  Flight {route.flightNumber}
                  <FlightLandIcon style={{ verticalAlign: 'middle', color: '#87CEEB' }} />
                </Typography>
                <Typography color="white"><strong>Departure:</strong> {route.departureIata} ({route.departureTime})</Typography>
                <Typography color="white"><strong>Arrival:</strong> {route.arrivalIata} ({route.arrivalTime})</Typography>
                <Typography color="white"><strong>Airline:</strong> {route.airlineIata}</Typography>
                <Typography color="white"><strong>ICAO:</strong> {route.airlineIcao}</Typography>
                <RegistrationNumbers registrationNumbers={route.regNumber || []} />
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SearchByRoute;
