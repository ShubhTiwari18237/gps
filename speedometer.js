const speedElement = document.getElementById('speed');
const unitElement = document.getElementById('unit');
const distanceElement = document.getElementById('distance');
const maxSpeedElement = document.getElementById('maxSpeed');
const maxSpeedUnitElement = document.getElementById('maxSpeedUnit');
const avgSpeedElement = document.getElementById('avgSpeed');
const avgSpeedUnitElement = document.getElementById('avgSpeedUnit');
const toggleUnitButton = document.getElementById('toggleUnit');
const resetSpeedButton = document.getElementById('resetSpeed');
const resetDistanceButton = document.getElementById('resetDistance');

let isKmh = true;
let totalDistance = 0; // Total distance in meters
let lastPosition = null;
let maxSpeed = 0; // Track maximum speed
let speedReadings = []; // Store speed readings for average speed
let startTime = Date.now(); // Track start time for average speed calculation

// Function to calculate distance between two coordinates (in meters)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Toggle between km/h and mph
toggleUnitButton.addEventListener('click', () => {
  isKmh = !isKmh;
  unitElement.textContent = isKmh ? 'km/h' : 'mph';
  maxSpeedUnitElement.textContent = isKmh ? 'km/h' : 'mph';
  avgSpeedUnitElement.textContent = isKmh ? 'km/h' : 'mph';
  toggleUnitButton.textContent = isKmh ? 'Switch to mph' : 'Switch to km/h';
});

// Reset speed
resetSpeedButton.addEventListener('click', () => {
  maxSpeed = 0;
  speedReadings = [];
  startTime = Date.now();
  maxSpeedElement.textContent = '0';
  avgSpeedElement.textContent = '0';
});

// Reset distance
resetDistanceButton.addEventListener('click', () => {
  totalDistance = 0;
  distanceElement.textContent = '0';
});

// Watch the user's position
navigator.geolocation.watchPosition(
  (position) => {
    const speed = position.coords.speed; // Speed in m/s
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Calculate distance traveled
    if (lastPosition) {
      const distance = calculateDistance(
        lastPosition.latitude,
        lastPosition.longitude,
        latitude,
        longitude
      );
      totalDistance += distance;
      distanceElement.textContent = (totalDistance / 1000).toFixed(2); // Convert to km
    }
    lastPosition = { latitude, longitude };

    // Update speed display
    if (speed === null || speed === undefined) {
      speedElement.textContent = '0';
      return;
    }

    const displaySpeed = isKmh ? (speed * 3.6).toFixed(2) : (speed * 2.23694).toFixed(2); // Convert to km/h or mph
    speedElement.textContent = displaySpeed;

    // Track maximum speed
    if (speed > maxSpeed) {
      maxSpeed = speed;
      const displayMaxSpeed = isKmh ? (maxSpeed * 3.6).toFixed(2) : (maxSpeed * 2.23694).toFixed(2);
      maxSpeedElement.textContent = displayMaxSpeed;
    }

    // Track average speed
    speedReadings.push(speed);
    const totalSpeed = speedReadings.reduce((sum, reading) => sum + reading, 0);
    const avgSpeed = totalSpeed / speedReadings.length;
    const displayAvgSpeed = isKmh ? (avgSpeed * 3.6).toFixed(2) : (avgSpeed * 2.23694).toFixed(2);
    avgSpeedElement.textContent = displayAvgSpeed;
  },
  (error) => {
    console.error('Error getting location:', error);
    alert('Error getting location. Please enable location services.');
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
  }
);