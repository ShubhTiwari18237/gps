const speedElement = document.getElementById('speed');
const unitElement = document.getElementById('unit');
const distanceElement = document.getElementById('distance');
const toggleUnitButton = document.getElementById('toggleUnit');
const resetDistanceButton = document.getElementById('resetDistance');

let isKmh = true;
let totalDistance = 0; // Total distance in meters
let lastPosition = null;

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
  toggleUnitButton.textContent = isKmh ? 'Switch to mph' : 'Switch to km/h';
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