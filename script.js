// Função para verificar a hora atual e definir o tema
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

// Obter coordenadas do usuário
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getSunriseAndSunset(lat, lon);
      },
      error => {
        console.error('Erro ao obter localização:', error);
        setThemeBasedOnTime(); // Fallback para alternância baseada no horário
      }
    );
  } else {
    console.error('Geolocalização não suportada pelo navegador.');
    setThemeBasedOnTime(); // Fallback para alternância baseada no horário
  }
}

// Obter informações de nascer e pôr do sol usando OpenWeather
function getSunriseAndSunset(lat, lon) {
  const apiKey = 'e7314838ebd86431d951d53c59e7fd20';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const sunrise = new Date(data.sys.sunrise * 1000); // Converter para milissegundos
      const sunset = new Date(data.sys.sunset * 1000); // Converter para milissegundos
      const now = new Date();

      if (now > sunrise && now < sunset) {
        setTheme(false); // Tema claro durante o dia
      } else {
        setTheme(true); // Tema escuro à noite
      }
    })
    .catch(error => {
      console.error('Erro ao buscar informações de nascer e pôr do sol:', error);
      setThemeBasedOnTime(); // Fallback para alternância baseada no horário
    });
}

// Definir tema com base no nascer e pôr do sol
function setTheme(isNight) {
  const body = document.body;
  if (isNight) {
    body.classList.add('dark-mode');
    document.getElementById('themeIcon').textContent = '☀️'; // Sol para o tema escuro
  } else {
    body.classList.remove('dark-mode');
    document.getElementById('themeIcon').textContent = '🌙'; // Lua para o tema claro
  }
}

// Buscar relatório do clima usando OpenWeather
document.getElementById('getWeatherBtn').addEventListener('click', function () {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('Por favor, insira o nome da cidade.');
    return;
  }
  getWeatherReport(city);
});

function getWeatherReport(cityName) {
  const apiKey = 'e7314838ebd86431d951d53c59e7fd20';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Cidade não encontrada.');
      return response.json();
    })
    .then(data => {
      displayWeatherReport(data);
    })
    .catch(error => {
      document.getElementById('weatherResult').innerHTML += `<p style="color: red;">Erro ao buscar relatório do clima para "${cityName}": ${error.message}</p>`;
    });
}

// Exibir relatório do clima
function displayWeatherReport(weatherData) {
  const cityName = weatherData.name;
  const temp = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const description = translateCondition(weatherData.weather[0].description);
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const windDirection = translateWindDirection(weatherData.wind.deg);
  const pressure = weatherData.main.pressure;
  const visibility = weatherData.visibility / 1000; // Converter para km
  const cloudCover = weatherData.clouds.all;

  const message = `
    <div class="weather-card">
      <h2>Clima Atual em ${cityName}</h2>
      <p><strong>Temperatura:</strong> ${temp}°C</p>
      <p><strong>Sensação Térmica:</strong> ${feelsLike}°C</p>
      <p><strong>Condição:</strong> ${description}</p>
      <p><strong>Umidade:</strong> ${humidity}%</p>
      <p><strong>Vento:</strong> ${windSpeed} km/h (${windDirection})</p>
      <p><strong>Pressão Atmosférica:</strong> ${pressure} hPa</p>
      <p><strong>Visibilidade:</strong> ${visibility.toFixed(1)} km</p>
      <p><strong>Cobertura de Nuvens:</strong> ${cloudCover}%</p>
    </div>
  `;
  // Adiciona o novo resultado sem apagar os anteriores
  document.getElementById('weatherResult').innerHTML += message;
}

// Traduz condições meteorológicas
function translateCondition(condition) {
  const conditions = {
    'clear sky': 'Céu Limpo',
    'few clouds': 'Poucas Nuvens',
    'scattered clouds': 'Nuvens Dispersas',
    'broken clouds': 'Nuvens Quebradas',
    'shower rain': 'Chuva Fraca',
    'rain': 'Chuva',
    'thunderstorm': 'Trovoada',
    'snow': 'Neve',
    'mist': 'Neblina',
  };
  return conditions[condition] || condition; // Retorna a tradução ou a condição original se não houver tradução disponível
}

// Traduz direção do vento
function translateWindDirection(degrees) {
  const directions = [
    'Norte', 'Norte-Nordeste', 'Nordeste', 'Leste-Nordeste',
    'Leste', 'Leste-Sudeste', 'Sudeste', 'Sul-Sudeste',
    'Sul', 'Sul-Sudoeste', 'Sudoeste', 'Oeste-Sudoeste',
    'Oeste', 'Oeste-Noroeste', 'Noroeste', 'Norte-Noroeste'
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

// Executa a função ao carregar a página
getLocation();
