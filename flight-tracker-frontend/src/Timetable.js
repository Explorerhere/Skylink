import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container,
  IconButton,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import backgroundImage from './Assests/stenza.png'; // Ensure the path is correct

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: '4px',
  boxShadow: theme.shadows[3],
  marginTop: '20px',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 'bold',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  '& th': {
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const SearchArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // Stack the search areas vertically
  alignItems: 'center',
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2, 0),
}));

const SearchFieldWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row', // Align search components in a row
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
  width: '100%', // Take the full width of the parent
  padding: theme.spacing(1),
  gap: theme.spacing(2), // Space between search components
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
  '& .MuiInputBase-input': {
    color: 'white', // Set the text color inside input to white
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)', // Set label color to a lighter white
  },
  '& label.Mui-focused': {
    color: '#87CEEB', // Keep the label color when focused
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'rgba(255, 255, 255, 0.7)', // Set the underline color before focus
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: 'rgba(255, 255, 255, 0.9)', // Set the underline color on hover
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#87CEEB', // Set the underline color after focus
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: '#87CEEB',
  color: 'white', // Button text color
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#87CEEB',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#87CEEB',
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
});

const StyledSearchButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: '#87CEEB',
  color: theme.palette.getContrastText('#87CEEB'),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function AirportTimetable() {
  const [airportCode, setAirportCode] = useState('');
  const [flights, setFlights] = useState({ arrivals: [], departures: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchTimetable = async () => {
    setIsLoading(true);
    setError('');
    try {
      const responseArrivals = await axios.get(`https://aviation-edge.com/v2/public/timetable`, {
        params: {
          key: 'f34fed-bff963',
          iataCode: airportCode,
          type: 'arrival',
        },
      });
      const responseDepartures = await axios.get(`https://aviation-edge.com/v2/public/timetable`, {
        params: {
          key: 'f34fed-bff963',
          iataCode: airportCode,
          type: 'departure',
        },
      });
  
      // Verify the data structure before setting state
      if (Array.isArray(responseArrivals.data) && Array.isArray(responseDepartures.data)) {
        setFlights({
          arrivals: responseArrivals.data,
          departures: responseDepartures.data,
        });
      } else {
        // Set an appropriate error if the response is not as expected
        setError('Please enter a valid IATA code');
      }
    } catch (err) {
      // Provide a user-friendly error message
      setError('Failed to fetch the timetable. Please check the IATA code and try again.');
      console.error(err);
    }
    setIsLoading(false);
  };
  
  const handleSearch = () => {
    if (airportCode.trim()) {
      fetchTimetable();
    } else {
      setError('Please enter a valid IATA code.');
    }
  };
  
  const handleFlightSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
    const filterFlights = (flightsList) =>
  Array.isArray(flightsList) ? flightsList.filter((flight) =>
    flight.flight.iataNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];


  return (
    <Container maxWidth="lg">
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          margin: 'auto',
        }}
      >
        {/* Airport IATA Code TextField */}
        <SearchTextField
          label="Airport IATA Code"
          variant="outlined"
          value={airportCode}
          onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearch}>
                <SearchIcon style={{ color: 'white' }} />
              </IconButton>
            ),
          }}
          sx={{
            marginRight: 2, // Adjust space between fields if necessary
            width: '45%', // Adjust width as necessary
          }}
        />
        {/* Search for a flight TextField */}
        <SearchTextField
          label="Search for a flight"
          variant="outlined"
          value={searchTerm}
          onChange={handleFlightSearch}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearchTerm('')}>
                <SearchIcon style={{ color: 'white' }} />
              </IconButton>
            ),
          }}
          sx={{
            width: '45%', // Adjust width as necessary
          }}
        />
      </Box>
    </SearchArea>
    {error && (
      <Box mt={2} mb={2}>
        <Typography variant="subtitle1" color="error">
          {error}
        </Typography>
      </Box>
    )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom style={{ color: 'white' }}>
            Departures
          </Typography>
          <RenderTable flights={filterFlights(flights.departures)} type="Departure" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom style={{ color: 'white' }}>
            Arrivals
          </Typography>
          <RenderTable flights={filterFlights(flights.arrivals)} type="Arrival" />
        </Grid>
      </Grid>
    </Container>
  );
}

function RenderTable({ flights, type }) {
  return (
    <StyledTableContainer component={Paper}>
      <Table aria-label={`${type} timetable`}>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>Flight Number</StyledTableCell>
            <StyledTableCell align="right">{type === 'Departure' ? 'Destination' : 'Origin'}</StyledTableCell>
            <StyledTableCell align="right">Scheduled Time</StyledTableCell>
            <StyledTableCell align="right">Gate</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {flights.map((flight, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{flight.flight.iataNumber}</StyledTableCell>
              <StyledTableCell align="right">{type === 'Departure' ? flight.arrival.iataCode : flight.departure.iataCode}</StyledTableCell>
              <StyledTableCell align="right">{moment(flight[type.toLowerCase()].scheduledTime).format('YYYY-MM-DD HH:mm')}</StyledTableCell>
              <StyledTableCell align="right">{flight[type.toLowerCase()].gate || 'N/A'}</StyledTableCell>
              <StyledTableCell align="right">{flight.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default AirportTimetable;
