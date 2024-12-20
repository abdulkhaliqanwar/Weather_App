// Add theme toggle function at the top
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        themeToggle.textContent = '🌙';
    } else {
        body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    }
}

// Input validation event listener
document.getElementById('city').addEventListener('input', function(e) {
    const searchButton = document.querySelector('button[onclick="getWeather()"]');
    if (e.target.value.trim().length > 2) {
        searchButton.removeAttribute('disabled');
    } else {
        searchButton.setAttribute('disabled', 'true');
    }
});

// Hover effect on weather cards
document.getElementById('hourly-forecast').addEventListener('mouseover', function(e) {
    if (e.target.closest('.hourly-item')) {
        const item = e.target.closest('.hourly-item');
        item.style.transform = 'scale(1.05)';
    }
});

document.getElementById('hourly-forecast').addEventListener('mouseout', function(e) {
    if (e.target.closest('.hourly-item')) {
        const item = e.target.closest('.hourly-item');
        item.style.transform = 'scale(1)';
    }
});

// Focus event listener for input field
document.getElementById('city').addEventListener('focus', function(e) {
    e.target.classList.add('focused');
});

// Blur event listener for input field
document.getElementById('city').addEventListener('blur', function(e) {
    e.target.classList.remove('focused');
});

// Keyboard event listener for Enter key
document.getElementById('city').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        getWeather();
    }
});

 const API_KEY = ``;

async function getWeather() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!currentResponse.ok) {
            throw new Error('City not found');
        }
        
        const currentData = await currentResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        const forecastData = await forecastResponse.json();

        displayWeather(currentData);
        displayHourlyForecast(forecastData.list);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `
        <p>${Math.round(data.main.temp)}°C</p>
    `;

    const weatherHtml = `
        <p>${data.name}</p>
        <p>${data.weather[0].description}</p>
        <p>Wind: ${Math.round(data.wind.speed)} m/s</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = data.weather[0].description;

    showImage();
}

function displayHourlyForecast(forecastList) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    
    // Using array iteration (map) to transform and filter the forecast data
    const next24Hours = forecastList
        .slice(0, 8) // Get next 24 hours (3-hour intervals)
        .map(item => {
            const date = new Date(item.dt * 1000);
            return `
                <div class="hourly-item">
                    <span>${date.getHours()}:00</span>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather Icon">
                    <span>${Math.round(item.main.temp)}°C</span>
                    <span>${Math.round(item.wind.speed)} m/s</span>
                </div>
            `;
        })
        .join('');

    hourlyForecastDiv.innerHTML = next24Hours;
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
