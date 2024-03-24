import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';

function AirportSearch() {
    const [query, setQuery] = useState(''); // Use "query" instead of "code"
    const [airportDetails, setAirportDetails] = useState(null);
    const [error, setError] = useState('');

    const searchAirport = async () => {
        setError('');
        setAirportDetails(null);
        try {
            // Update the fetch URL to use `query` as the parameter and encodeURIComponent for handling special characters
            const response = await fetch(`http://localhost:5000/searchAirport?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                const error = await response.json();
                setError(error.error);
                return;
            }
            const data = await response.json();
            setAirportDetails(data);
        } catch (err) {
            setError('Failed to fetch airport information');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <TextField
                label="Search by Airport or Location" // Update label to reflect new functionality
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)} // Update to use setQuery
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={searchAirport} style={{ marginTop: '10px' }}>
                Search
            </Button>
            {error && <Typography color="error" style={{ marginTop: '10px' }}>{error}</Typography>}
            {airportDetails && (
                <Card variant="outlined" style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h5">{airportDetails.name} ({airportDetails.code})</Typography>
                        <Typography variant="body2">City: {airportDetails.city || 'N/A'}</Typography>
                        <Typography variant="body2">Country ID: {airportDetails.country_id}</Typography>
                        <Typography variant="body2">Time Zone: {airportDetails.time_zone_id}</Typography>
                        <Typography variant="body2">Elevation: {airportDetails.elevation}m</Typography>
                        <Typography variant="body2">ICAO: {airportDetails.icao || 'N/A'}</Typography>
                        <Typography variant="body2">URL: {airportDetails.url || 'N/A'}</Typography>
                        <Typography variant="body2">Location: Latitude {airportDetails.location.coordinates[1]}, Longitude {airportDetails.location.coordinates[0]}</Typography>
                        <Typography variant="body2">Created At: {new Date(airportDetails.createdAt).toLocaleString()}</Typography>
                        <Typography variant="body2">Updated At: {new Date(airportDetails.updatedAt).toLocaleString()}</Typography>
                        {/* Add more details as needed */}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default AirportSearch;
