// Alternar Tema Automático com Base na Hora
function setThemeBasedOnTime() {
  const now = new Date();
  const hour = now.getHours(); // Obtém a hora atual (0-23)

  const body = document.body;

  // Define o tema com base na hora
  if (hour >= 6 && hour < 18) {
    body.classList.remove('dark-mode'); // Tema claro
    document.getElementById('themeIcon').textContent = '🌙'; // Ícone de lua
  } else {
    body.classList.add('dark-mode'); // Tema escuro
    document.getElementById('themeIcon').textContent = '☀️'; // Ícone de sol
  }
}

// Executa a função ao carregar a página
setThemeBasedOnTime();

// Alternar Tema Manualmente
const themeButton = document.getElementById('themeButton');
const themeIcon = document.getElementById('themeIcon');

themeButton.addEventListener('click', () => {
  const body = document.body;
  body.classList.toggle('dark-mode');

  // Alterar o ícone de acordo com o tema
  if (body.classList.contains('dark-mode')) {
    themeIcon.textContent = '☀️'; // Sol para o tema escuro
  } else {
    themeIcon.textContent = '🌙'; // Lua para o tema claro
  }
});

// Buscar Clima Atual
document.getElementById('getWeatherBtn').addEventListener('click', function () {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('Por favor, insira o nome da cidade.');
    return;
  }
  getWeatherReport(city);
});

function getWeatherReport(cityName) {
  const openWeatherToken = 'e7314838ebd86431d951d53c59e7fd20'; // Substitua pela sua chave da API da OpenWeatherMap

  // URL da API para buscar o clima atual por nome da cidade
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${openWeatherToken}&units=metric&lang=pt_br`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      displayWeatherReport(cityName, data);
    })
    .catch(error => {
      console.error(error); // Registra o erro no console para depuração
      document.getElementById('weatherResult').innerHTML += `<p style="color: red;">Erro ao buscar relatório do clima para "${cityName}": ${error.message}</p>`;
    });
}

function displayWeatherReport(cityName, weather) {
  const temp = weather.main.temp; // Temperatura em °C
  const feelsLike = weather.main.feels_like; // Sensação térmica em °C
  const description = weather.weather[0].description; // Descrição do clima (já traduzida para pt-br)
  const humidity = weather.main.humidity; // Umidade em %
  const windSpeed = weather.wind.speed; // Velocidade do vento em m/s
  const windDirection = translateWindDirection(weather.wind.deg); // Direção do vento
  const pressure = weather.main.pressure; // Pressão atmosférica em hPa
  const visibility = weather.visibility / 1000; // Visibilidade em km
  const cloudCover = weather.clouds.all; // Cobertura de nuvens em %

  const message = `
    <div class="weather-card">
      <h2>Clima Atual em ${cityName}</h2>
      <p><strong>Temperatura:</strong> ${temp}°C</p>
      <p><strong>Sensação Térmica:</strong> ${feelsLike}°C</p>
      <p><strong>Condição:</strong> ${capitalizeFirstLetter(description)}</p>
      <p><strong>Umidade:</strong> ${humidity}%</p>
      <p><strong>Vento:</strong> ${windSpeed} m/s (${windDirection})</p>
      <p><strong>Pressão Atmosférica:</strong> ${pressure} hPa</p>
      <p><strong>Visibilidade:</strong> ${visibility.toFixed(1)} km</p>
      <p><strong>Cobertura de Nuvens:</strong> ${cloudCover}%</p>
    </div>
  `;

  // Adiciona o novo resultado sem apagar os anteriores
  document.getElementById('weatherResult').innerHTML += message;
}

// Traduz direção do vento
function translateWindDirection(degrees) {
  const directions = ['Norte', 'Norte-Nordeste', 'Nordeste', 'Leste-Nordeste', 'Leste', 'Leste-Sudeste', 'Sudeste', 'Sul-Sudeste', 'Sul', 'Sul-Sudoeste', 'Sudoeste', 'Oeste-Sudoeste', 'Oeste', 'Oeste-Noroeste', 'Noroeste', 'Norte-Noroeste'];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index];
}

// Capitaliza a primeira letra de uma string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
