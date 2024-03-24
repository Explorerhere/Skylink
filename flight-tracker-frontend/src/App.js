import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChakraProvider } from '@chakra-ui/react';
import Container from '@mui/material/Container';
import AirportSearch from './AirportSearch';
import SideBar from './SideBar';

import NavBar from './NavBar';
import HomePage from './HomePage';
import Login from './Login';
import FlightSearch from './FlightSearch';
import AirportTimetable from './Timetable';
import SearchByRoute from './SearchbyRoute';
import SignUp from './Signup';
import Profile from './Profile'; // Assuming you have this component for logged-in users
import { AuthProvider } from './AuthContext';
import HistoricalFlight from './HistoricalFlight';

// Define Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'normal',
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <NavBar />
            <Container component="main" maxWidth="lg">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/flightsearch" element={<FlightSearch />} />
                <Route path="/airporttimetable" element={<AirportTimetable />} />
                <Route path="/searchbyroute" element={<SearchByRoute />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/HistoricalFlight" element={<HistoricalFlight />} />
                <Route path="/AirportSearch" element={<AirportSearch/>} />

                {/* You can add more routes here */}
              </Routes>
            </Container>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
