// Alternar tema escuro/claro
const themeButton = document.getElementById('themeButton');
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Buscar clima
document.getElementById('searchButton').addEventListener('click', function () {
  const city = document.getElementById('searchInput').value.trim();
  if (!city) {
    alert('Por favor, insira o nome da cidade.');
    return;
  }
  fetchWeather(city);
});

function fetchWeather(cityName) {
  const apiKey = 'e7314838ebd86431d951d53c59e7fd20';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=pt_br`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('Cidade não encontrada.');
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      alert(error.message || 'Erro ao buscar dados climáticos.');
    });
}

function displayWeather(weather) {
  const weatherResult = document.getElementById('weatherResult');
  weatherResult.innerHTML = `
    <div class="weather-card">
      <p><strong>${weather.name}</strong></p>
      <p>${Math.round(weather.main.temp)}°C</p>
      <p>${weather.weather[0].description}</p>
    </div>
  `;
}
