// Função para buscar dados climáticos
function fetchWeather(query) {
    const apiKey = 'e7314838ebd86431d951d53c59e7fd20';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric&lang=pt_br`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Cidade não encontrada. Verifique o nome ou tente novamente.');
            }
            return response.json();
        })
        .then(data => {
            // Atualizar os elementos da página com os dados recebidos
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('location').textContent = data.name;
            document.getElementById('feels-like').textContent = `Sensação: ${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = `Umidade: ${data.main.humidity}%`;
            document.getElementById('wind').textContent = `Vento: ${Math.round(data.wind.speed)} km/h (${translateWindDirection(data.wind.deg)})`;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            // Salvar o último local pesquisado no localStorage
            localStorage.setItem('lastLocation', query);
        })
        .catch(error => {
            console.error('Erro ao buscar dados climáticos:', error);
            alert(error.message || 'Não foi possível obter os dados climáticos. Verifique sua conexão ou tente novamente.');
        });
}

// Evento de clique no botão "Buscar"
document.getElementById('searchButton').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value.trim(); // Remove espaços extras
    if (!query) {
        alert('Por favor, insira um CEP ou nome de cidade.');
        return;
    }
    fetchWeather(query);
});

// Verificar se há um último local salvo no localStorage ao carregar a página
window.addEventListener('load', function () {
    const lastLocation = localStorage.getItem('lastLocation');
    if (lastLocation) {
        document.getElementById('searchInput').value = lastLocation; // Preencher o campo de pesquisa
        fetchWeather(lastLocation); // Buscar os dados climáticos automaticamente
    } else {
        // Caso não haja local salvo, exibir mensagem padrão
        document.getElementById('temperature').textContent = '--°C';
        document.getElementById('description').textContent = 'Carregando...';
        document.getElementById('location').textContent = 'Localização';
        document.getElementById('feels-like').textContent = 'Sensação: --°C';
        document.getElementById('humidity').textContent = 'Umidade: --%';
        document.getElementById('wind').textContent = 'Vento: -- km/h (--)';
        document.getElementById('weather-icon').src = '';
    }

    // Definir tema automático com base na hora
    setThemeBasedOnTime();
});

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
