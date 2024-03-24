const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Airport = require('./Airport'); // Adjust the path to where your Airport model is located
require('dotenv').config();

const results = [];

function transformLocation(pointString) {
    const matches = pointString.match(/POINT \(([^)]+)\)/);
    if (matches) {
        const parts = matches[1].split(' ');
        return {
            type: "Point",
            coordinates: [parseFloat(parts[0]), parseFloat(parts[1])]
        };
    }
    return null;
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB');
    fs.createReadStream('C:\\Users\\Rithika\\flight_tracker_backend\\New folder\\Airports-main\\airports.csv') // Update this path to your CSV file
        .pipe(csv())
        .on('data', (data) => {
            results.push({
                code: data.code,
                time_zone_id: data.time_zone_id,
                name: data.name,
                city_code: data.city_code,
                country_id: data.country_id,
                location: transformLocation(data.location),
                elevation: data.elevation,
                url: data.url,
                icao: data.icao,
                city: data.city,
                county: data.county,
                state: data.state
            });
        })
        .on('end', () => {
            Airport.insertMany(results)
                .then(() => {
                    console.log('Successfully imported airports into MongoDB');
                    mongoose.disconnect();
                })
                .catch((error) => {
                    console.error('Error importing airports:', error);
                    mongoose.disconnect();
                });
        });
}).catch(err => console.error('Could not connect to MongoDB', err));
