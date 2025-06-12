const API_KEY = '6b28baeb43d72bf569d9b423f55c3318';
let debounceTimer;
let lastClick = 0;

document.getElementById('searchBtn').addEventListener('click', () => {
  const now = Date.now();
  if (now - lastClick > 1000) {
    fetchWeather();
    lastClick = now;
  }
});

document.getElementById('cityInput').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchWeather, 800);
});

let map;
function initMap(lat = 0, lon = 0) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng: lon },
    zoom: 8,
  });
}
window.initMap = initMap;

function fetchWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return;

  document.getElementById('loading').style.display = 'block';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      document.getElementById('loading').style.display = 'none';
      const weatherHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      `;
      document.getElementById('weatherInfo').innerHTML = weatherHTML;
      document.getElementById('forecastBtn').style.display = 'inline-block';

      initMap(data.coord.lat, data.coord.lon);
      localStorage.setItem('city', data.name);
    })
    .catch(err => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('weatherInfo').innerHTML = `<p style="color:red;">${err.message}</p>`;
      document.getElementById('map').innerHTML = '';
    });
}

document.getElementById('forecastBtn').addEventListener('click', () => {
  window.location.href = 'forecast.html';
});
