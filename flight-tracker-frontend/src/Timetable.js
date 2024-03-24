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

const StyledTextField = styled(TextField)({
  margin: '10px 0',
  width: '100%',
});

const SearchButton = styled(Button)({
  margin: '10px 0',
});

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
          key: '51e895-9bde28', // Replace with your actual API key
          iataCode: airportCode,
          type: 'arrival',
        },
      });
      const responseDepartures = await axios.get(`https://aviation-edge.com/v2/public/timetable`, {
        params: {
          key: '51e895-9bde28', // Replace with your actual API key
          iataCode: airportCode,
          type: 'departure',
        },
      });
      setFlights({
        arrivals: responseArrivals.data,
        departures: responseDepartures.data,
      });
    } catch (err) {
      setError('Failed to fetch the timetable.');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    fetchTimetable();
  };

  const handleFlightSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterFlights = (flightsList) =>
    flightsList.filter((flight) =>
      flight.flight.iataNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Airport Timetable
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', gap: 2 }}>
        <StyledTextField
          label="Airport IATA Code"
          variant="outlined"
          value={airportCode}
          onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
        />
        <SearchButton
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </SearchButton>
      </Box>
      {error && <Typography color="error">{error}</Typography>}

      <StyledTextField
        label="Search for a flight"
        variant="outlined"
        value={searchTerm}
        onChange={handleFlightSearch}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setSearchTerm('')}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />

      {/* Grid Layout for Tables */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Departures
          </Typography>
          <RenderTable flights={filterFlights(flights.departures)} type="Departure" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
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
              <StyledTableCell align="right">{moment(type === 'Departure' ? flight.departure.scheduledTime : flight.arrival.scheduledTime).format('YYYY-MM-DD HH:mm')}</StyledTableCell>
              <StyledTableCell align="right">{type === 'Departure' ? flight.departure.gate || 'N/A' : flight.arrival.gate || 'N/A'}</StyledTableCell>
              <StyledTableCell align="right">{flight.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default AirportTimetable;
