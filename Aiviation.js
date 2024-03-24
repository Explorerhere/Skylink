const axios = require('axios');
const fs = require('fs');

// Function to fetch flight stats for a given airport IATA code
const fetchAirportStats = async (iataCode) => {
  const options = {
    method: 'GET',
    url: `https://aerodatabox.p.rapidapi.com/airports/iata/${iataCode}/stats/routes/daily`,
    headers: {
      'X-RapidAPI-Key': '3bb0572d02mshefe17c4255a9008p1eaf46jsne8fd3b001a91',
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(JSON.stringify(response.data, null, 2));
    // Save data to a file, optionally process it before saving
    const fileName = `${iataCode}_stats.txt`;
    fs.writeFile(fileName, JSON.stringify(response.data, null, 2), (err) => {
      if (err) throw err;
      console.log(`The data has been saved to ${fileName}!`);
    });
  } catch (error) {
    console.error(error);
  }
};

// Example usage
fetchAirportStats('HYD'); // Replace 'HYD' with any IATA code as needed
