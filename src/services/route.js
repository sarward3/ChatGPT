// Placeholder routing using openrouteservice or similar
const axios = require('axios');

module.exports.getRoute = async function(start, end) {
  // start/end: { lat, lng }
  // In production, call maps API. Here we mock with straight line distance.
  const distance = Math.sqrt(
    Math.pow(start.lat - end.lat, 2) + Math.pow(start.lng - end.lng, 2)
  );
  // Return an array of coordinates representing the route
  return {
    distance,
    path: [start, end]
  };
};
