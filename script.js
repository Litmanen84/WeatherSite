let cityName = document.getElementById('city');
let button = document.getElementById('enter');
let forecastContainer = document.getElementById('forecast');

const fetchWeather = async (city) => {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=b96737e9b0bfb9450fea0d3992856bcb&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('There was an error fetching the weather data:', error);
        throw error;
    }
};

const createForecastContainer = () => {
    let forecastDiv = document.createElement('div');
    forecastContainer.appendChild(forecastDiv);
    return forecastDiv;
};

const displayForecast = (forecastData) => {
    let forecastDiv = createForecastContainer();
    forecastDiv.classList.add(`forecastDiv`)
    let forecastTitle = document.createElement(`h2`);
    forecastTitle.textContent = cityName.value;
    forecastDiv.appendChild(forecastTitle);
    let itemContainer = document.createElement(`div`);
    itemContainer.classList.add(`item-container`);
    forecastDiv.appendChild(itemContainer);

    let currentDate = null;
    let dayCounter = 0;

    const dates = [];
    const temperatures = [];

    for (const forecast of forecastData.list) {
        const forecastDate = new Date(forecast.dt * 1000);
        const forecastDateString = forecastDate.toDateString();

        if (forecastDateString !== currentDate) {
            currentDate = forecastDateString;
            dayCounter++;
            if (dayCounter > 5) {
                break;
            }

            const date = forecastDate.toLocaleDateString();
            const temperature = forecast.main.temp;
            dates.push(date);
            temperatures.push(temperature);
            
            let forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `<p>${date}</p>
                                    <p>${temperature}°C</p>`;
            itemContainer.appendChild(forecastItem)
        }
    }

    const ctx = document.createElement('canvas');
    forecastDiv.appendChild(ctx);

    const temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    if (forecastContainer.childElementCount > 2) {
        forecastContainer.removeChild(forecastContainer.firstElementChild);
    }
};

button.addEventListener('click', async function () {
    let city = cityName.value.trim();
    if (city !== '') {
        try {
            let weatherData = await fetchWeather(city);
            displayForecast(weatherData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    } else {
        console.error('Please enter a city name');
    }
});