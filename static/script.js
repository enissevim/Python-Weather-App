async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = capitalizeFirstLetter(cityInput.value.trim());

    if (!cityName) {
        alert('Please enter a city name');
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
        const weatherOutput = document.getElementById('weatherOutput');
        const weatherInput = document.getElementById('weatherInput');

        if (data.hasOwnProperty('error')) {
            alert(data.error);
        } else {
            weatherOutput.style.display = 'block';
            weatherInput.style.display = 'none';

            document.getElementById('location').innerHTML = `<h2>${capitalizeFirstLetter(cityName)}</h2>`;
            document.getElementById('dateTime').innerHTML = `<p>${getDateTime()}</p>`;
            document.getElementById('weatherResult').innerHTML = `<p>${getWeatherDescription(data.weather)}</p>`;
            updateTemperature(data.temp, 'imperial');
            createUnitToggle(data.unit);
        }
    } catch (error) {
        console.error('Error fetching weather data', error);
    }
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

function hideSwitchButton() {
    const unitSwitch = document.getElementById('unitSwitch');
    unitSwitch.style.display = 'none';
}

function showSwitchButton() {
    const unitSwitch = document.getElementById('unitSwitch');
    unitSwitch.style.display = 'block';
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

function backToInput() {
    const weatherOutput = document.getElementById('weatherOutput');
    const weatherInput = document.getElementById('weatherInput');

    weatherOutput.style.display = 'none';
    weatherInput.style.display = 'block';

    document.getElementById('cityInput').value = '';
}