// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // Define your color scheme
    primary: {
      main: '#00bcd4', // Cyan-like color for a futuristic vibe
    },
    secondary: {
      main: '#ff4081', // Accent color
    },
    background: {
      default: '#303030', // Dark background for a modern look
      paper: '#424242',
    },
  },
  typography: {
    // You can customize your typography here
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '2rem',
      color: '#00bcd4',
      fontWeight: 500,
    },
    h5: {
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
    },
  },
  components: {
    // Use this section to customize component styles globally
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Rounded buttons for a modern look
        },
      },
    },
  },
});

export default theme;
