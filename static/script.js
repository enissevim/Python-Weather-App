async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = capitalizeFirstLetter(cityInput.value.trim());

    if (!cityName) {
        document.getElementById('error').innerText = 'Please enter a city name';
        return;
    }

    try {
        const response = await fetch('/get_weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `city=${cityName}`,
        });

        const data = await response.json();
        console.log(data); // Log the response data

        if (data.hasOwnProperty('error')) {
            document.getElementById('error').innerText = data.error;
        } else {
            document.getElementById('error').innerText = '';
            document.getElementById('weatherOutput').style.display = 'block';
            document.getElementById('weatherInput').style.display = 'none';

            document.getElementById('location').innerHTML = `<h2>${capitalizeFirstLetter(cityName)}</h2>`;
            document.getElementById('dateTime').innerHTML = `<p>${getDateTime()}</p>`;
            document.getElementById('weatherResult').innerHTML = `<p>${getWeatherDescription(data.weather)}</p>`;
            updateTemperature(data.temp, 'imperial');
            createUnitToggle('imperial');

            // Update background based on weather
            updateBackground(data.weather);
        }
    } catch (error) {
        console.error('Error fetching weather data', error);
        document.getElementById('error').innerText = 'Error fetching weather data';
    }
}

function updateBackground(weather) {
    const body = document.body;

    switch (weather.toLowerCase()) {
        case 'clouds':
            body.style.backgroundImage = 'url("/static/Partly-Cloudy.jpg")';
            break;
        case 'rain':
            body.style.backgroundImage = 'url("/static/Rainy.avif")';
            break;
        case 'snow':
            body.style.backgroundImage = 'url("/static/Snow.png")';
            break;
        case 'clear':
            body.style.backgroundImage = 'url("/static/Sunny.png")';
            break;
        default:
            body.style.backgroundImage = 'url("/static/default-background.jpg")'; // Default background
            break;
    }
}

function backToInput() {
    const weatherOutput = document.getElementById('weatherOutput');
    const weatherInput = document.getElementById('weatherInput');

    weatherOutput.style.display = 'none';
    weatherInput.style.display = 'block';

    document.getElementById('cityInput').value = '';

    // Reset background to default
    document.body.style.backgroundImage = 'url("/static/wvNCf.png")';
}

function updateTemperature(temp, unit) {
    const temperature = document.getElementById('temperature');
    const temperatureUnit = unit === 'metric' ? 'C' : 'F';
    temperature.innerHTML = `<p class="temperature">${Math.round(temp)}°${temperatureUnit}</p>`;
}

function createUnitToggle(unit) {
    const unitSwitch = document.getElementById('unitSwitch');
    unitSwitch.innerHTML = `
        <label class="switch">
            <input type="checkbox" id="unitToggle" onchange="toggleUnit()" ${unit === 'metric' ? 'checked' : ''}>
            <span class="slider round"></span>
        </label>
        <span id="unitLabel">${unit === 'metric' ? 'C' : 'F'}</span>
    `;
}

function toggleUnit() {
    const unitToggle = document.getElementById('unitToggle');
    const unitLabel = document.getElementById('unitLabel');
    const temperature = document.getElementById('temperature');
    const currentTemp = parseFloat(temperature.innerText);

    if (unitToggle.checked) {
        const newTemp = convertToCelsius(currentTemp);
        temperature.innerHTML = `<p class="temperature">${Math.round(newTemp)}°C</p>`;
        unitLabel.innerText = 'Celsius';
    } else {
        const newTemp = convertToFahrenheit(currentTemp);
        temperature.innerHTML = `<p class="temperature">${Math.round(newTemp)}°F</p>`;
        unitLabel.innerText = 'Fahrenheit';
    }
}

function convertToFahrenheit(celsiusTemp) {
    return (celsiusTemp * 9/5) + 32;
}

function convertToCelsius(fahrenheitTemp) {
    return (fahrenheitTemp - 32) * 5/9;
}

function getWeatherDescription(weather) {
    if (weather.toLowerCase() === 'clouds') {
        return 'Cloudy';
    }
    return weather;
}

function getDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    };
    return now.toLocaleString('en-US', options);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}