import React, { useState, useEffect,useContext  } from 'react';
import './watchlist.css'; // Assuming this is the path to your CSS file for Watchlist

// A mock function to simulate fetching watchlist items from a server or local storage
const fetchWatchlistItems = () => {
  // This would be replaced with an actual API call or local storage retrieval
  return Promise.resolve([
    { id: 'FLIGHT001', flightNumber: 'AA123', departure: 'JFK', arrival: 'LAX', status: 'On Time' },
    { id: 'FLIGHT002', flightNumber: 'BA456', departure: 'LHR', arrival: 'JFK', status: 'Delayed' },
    // ...add more mock flights
  ]);
};

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    fetchWatchlistItems().then(items => {
      setWatchlist(items);
    });
  }, []);

  const removeFromWatchlist = (flightId) => {
    // Update this function to handle removing items from the watchlist
    setWatchlist(currentWatchlist => currentWatchlist.filter(item => item.id !== flightId));
  };

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <div>
          {watchlist.map(({ id, flightNumber, departure, arrival, status }) => (
            <div key={id} className="watchlist-item">
              <div className="flight-details">
                <p><strong>Flight:</strong> {flightNumber}</p>
                <p><strong>Departure:</strong> {departure}</p>
                <p><strong>Arrival:</strong> {arrival}</p>
                <p><strong>Status:</strong> {status}</p>
              </div>
              <button onClick={() => removeFromWatchlist(id)} className="remove-button">
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
