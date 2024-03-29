require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Using bcryptjs here
const jwt = require('jsonwebtoken');
const Airport = require('./Airport'); // Ensure this path matches your file structure

const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.AVIATION_EDGE_API_KEY;
const baseUrl = 'https://aviation-edge.com/v2/public/flights';
const mongoDBUri = process.env.MONGODB_URI;
const Twilio = require('twilio');
const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// MongoDB connection
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.get('/searchAirport', async (req, res) => {
  const { query } = req.query; // Use "query" to accept various types of search inputs

  // Ensure the "query" parameter is provided
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Extend the query logic to include city, county, and state fields
    const airport = await Airport.findOne({
      $or: [
        { code: query.toUpperCase() }, // Assuming codes are stored in uppercase
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search for the name
        { city: { $regex: query, $options: 'i' } }, // Case-insensitive search for the city
        { county: { $regex: query, $options: 'i' } }, // Case-insensitive search for the county
        { state: { $regex: query, $options: 'i' } }  // Case-insensitive search for the state
      ]
    }).lean();

    // If no matching airport document is found, return a 404 Not Found response
    if (!airport) {
      return res.status(404).json({ error: 'Airport not found' });
    }

    // Successfully found an airport document; return it in the response
    res.json({
      _id: airport._id,
      code: airport.code,
      time_zone_id: airport.time_zone_id,
      name: airport.name,
      city_code: airport.city_code,
      country_id: airport.country_id,
      location: airport.location,
      elevation: airport.elevation,
      url: airport.url,
      icao: airport.icao,
      city: airport.city,
      county: airport.county,
      state: airport.state,
      createdAt: airport.createdAt,
      updatedAt: airport.updatedAt
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error(`Error fetching airport information: ${error}`);
    res.status(500).json({ error: 'Failed to fetch airport information' });
  }
});

// Flight search endpoint
app.get('/searchFlight', async (req, res) => {
  const { flightNumber } = req.query;
  if (!flightNumber) {
    return res.status(400).send({ error: 'Flight number is required' });
  }

  try {
    const response = await axios.get(`${baseUrl}?flightIata=${flightNumber}&key=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching flight info: ${error}`);
    res.status(500).send({ error: 'Failed to fetch flight information' });
  }
});
app.post('/sendFlightDetailsSMS', async (req, res) => {
  const { phoneNumber, flightDetails } = req.body;
  
  // Basic validation
  if (!phoneNumber || !flightDetails) {
      return res.status(400).send({ error: 'Missing phoneNumber or flightDetails in the request body.' });
  }
  
  try {
      const message = `Your flight ${flightDetails.flight.iataNumber} from ${flightDetails.departure.fullName} to ${flightDetails.arrival.fullName} is currently ${flightDetails.status}.`;
      
      const sentMessage = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number in E.164 format, e.g., +1234567890
          to: phoneNumber // Ensure the phone number is in E.164 format
      });
      
      console.log(`Message sent successfully with SID: ${sentMessage.sid}`);
      res.send({ message: 'SMS sent successfully.', sid: sentMessage.sid });
  } catch (error) {
      console.error('Failed to send SMS:', error);
      res.status(500).send({ error: 'Failed to send SMS due to an internal error.' });
  }
});

 
// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already exists');
    }
    user = new User({ name, email, password, phoneNumber });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Modifying the response here to include a success message along with the token
    res.json({ 
      message: 'Login successfully', // Success message
      token // JWT token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// Assuming you're using Express and have middleware for authentication


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
