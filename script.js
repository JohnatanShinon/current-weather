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

// Restante do código permanece igual
document.getElementById('getWeatherBtn').addEventListener('click', function () {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('Por favor, insira o nome da cidade.');
    return;
  }
  getWeatherReport(city);
});

function getWeatherReport(cityName) {
  const accuweatherToken = 'QIEVUx0jvG91HHWq9xTrbpgtGSnSiA94'; // Substitua pela sua chave da API da AccuWeather

  // Etapa 1: Obter a chave de localização
  fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${accuweatherToken}&q=${encodeURIComponent(cityName)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        throw new Error('Cidade não encontrada.');
      }
      const locationKey = data[0].Key;
      const cityName = data[0].LocalizedName;
      return { locationKey, cityName };
    })
    .then(({ locationKey, cityName }) => {
      // Etapa 2: Obter o relatório do clima atual
      return fetch(`https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${accuweatherToken}&details=true`)
        .then(response => response.json())
        .then(weatherData => {
          const weather = weatherData[0];
          displayWeatherReport(cityName, weather);
        });
    })
    .catch(error => {
      document.getElementById('weatherResult').innerHTML += `<p style="color: red;">Erro ao buscar relatório do clima para "${cityName}": ${error.message}</p>`;
    });
}

function displayWeatherReport(cityName, weather) {
  const temp = weather.Temperature.Metric.Value;
  const feelsLike = weather.RealFeelTemperature.Metric.Value;
  const description = translateCondition(weather.WeatherText);
  const humidity = weather.RelativeHumidity;
  const windSpeed = weather.Wind.Speed.Metric.Value;
  const windDirection = translateWindDirection(weather.Wind.Direction.Localized);
  const uvIndex = weather.UVIndex;
  const pressure = weather.Pressure.Metric.Value;
  const visibility = weather.Visibility.Metric.Value;
  const cloudCover = weather.CloudCover;

  const message = `
    <div class="weather-card">
      <h2>Clima Atual em ${cityName}</h2>
      <p><strong>Temperatura:</strong> ${temp}°C</p>
      <p><strong>Sensação Térmica:</strong> ${feelsLike}°C</p>
      <p><strong>Condição:</strong> ${description}</p>
      <p><strong>Umidade:</strong> ${humidity}%</p>
      <p><strong>Vento:</strong> ${windSpeed} km/h (${windDirection})</p>
      <p><strong>Índice UV:</strong> ${translateUVIndex(uvIndex)}</p>
      <p><strong>Pressão Atmosférica:</strong> ${pressure} hPa</p>
      <p><strong>Visibilidade:</strong> ${visibility} km</p>
      <p><strong>Cobertura de Nuvens:</strong> ${cloudCover}%</p>
    </div>
  `;

  // Adiciona o novo resultado sem apagar os anteriores
  document.getElementById('weatherResult').innerHTML += message;
}

// Traduz condições meteorológicas
function translateCondition(condition) {
  const conditions = {
    'Clear': 'Céu Limpo',
    'Partly Cloudy': 'Parcialmente Nublado',
    'Cloudy': 'Nublado',
    'Rain': 'Chuva',
    'Snow': 'Neve',
    'Thunderstorm': 'Trovoada',
    'Fog': 'Nevoeiro',
    'Haze': 'Neblina',
    'Showers': 'Pancadas de Chuva',
    'Drizzle': 'Garoa',
    'Sunny': 'Ensolarado',
    'Mostly Sunny': 'Predominantemente Ensolarado',
    'Partly Sunny': 'Parcialmente Ensolarado',
    'Mostly Cloudy': 'Predominantemente Nublado',
    'Overcast': 'Encoberto',
    'T-Storms': 'Tempestades',
    'Light Rain': 'Chuva Leve',
    'Heavy Rain': 'Chuva Forte',
    'Freezing Rain': 'Chuva Congelante',
    'Sleet': 'Granizo',
    'Flurries': 'Flocos de Neve',
    'Blizzard': 'Nevasca',
    'Dust': 'Poeira',
    'Smoke': 'Fumaça',
    'Hail': 'Granizo',
    'Windy': 'Ventoso',
    'Light snow': 'Neve leve',
    'Heavy snow': 'Neve forte',
  };
  return conditions[condition] || condition; // Retorna a tradução ou a condição original se não houver tradução disponível
}

// Traduz direção do vento
function translateWindDirection(direction) {
  const directions = {
    'N': 'Norte',
    'NNE': 'Norte-Nordeste',
    'NE': 'Nordeste',
    'ENE': 'Leste-Nordeste',
    'E': 'Leste',
    'ESE': 'Leste-Sudeste',
    'SE': 'Sudeste',
    'SSE': 'Sul-Sudeste',
    'S': 'Sul',
    'SSW': 'Sul-Sudoeste',
    'SW': 'Sudoeste',
    'WSW': 'Oeste-Sudoeste',
    'W': 'Oeste',
    'WNW': 'Oeste-Noroeste',
    'NW': 'Noroeste',
    'NNW': 'Norte-Noroeste',
  };
  return directions[direction] || direction;
}

// Traduz índice UV
function translateUVIndex(uvIndex) {
  if (uvIndex <= 2) return 'Baixo';
  if (uvIndex <= 5) return 'Moderado';
  if (uvIndex <= 7) return 'Alto';
  if (uvIndex <= 10) return 'Muito Alto';
  return 'Extremo';
}

function getSunriseAndSunset(lat, lon) {
  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const sunrise = new Date(data.results.sunrise);
      const sunset = new Date(data.results.sunset);
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

// Obter coordenadas do usuário
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getSunriseAndSunset(lat, lon);
    }, error => {
      console.error('Erro ao obter localização:', error);
      setThemeBasedOnTime(); // Fallback para alternância baseada no horário
    });
  } else {
    console.error('Geolocalização não suportada pelo navegador.');
    setThemeBasedOnTime(); // Fallback para alternância baseada no horário
  }
}

// Executa a função ao carregar a página
getLocation();
