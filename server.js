require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS module

const app = express();
const port = process.env.PORT || 5000;

// Apply CORS middleware to accept requests from the specified origin
app.use(cors({ origin: 'http://localhost:3000' }));

const API_KEY = process.env.AVIATION_EDGE_API_KEY;
const BASE_URL = 'https://aviation-edge.com/v2/public/flights';

app.get('/searchFlight', async (req, res) => {
    const { flightNumber } = req.query;
    if (!flightNumber) {
        return res.status(400).send({ error: 'Flight number is required' });
    }

    try {
        const response = await axios.get(`${BASE_URL}?flightIata=${flightNumber}&key=${API_KEY}`);
        // Assuming the response from the API is directly what you want to forward
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching flight info: ${error}`);
        res.status(500).send({ error: 'Failed to fetch flight information' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
