async function fetchData() {
    const city = document.getElementById('cityInput').value;
    const errorDiv = document.getElementById('error');

    errorDiv.innerText = "";

    if (!city) {
        errorDiv.innerText = "Please enter a city name.";
        return;
    }

    try {
        const weatherRes = await fetch(`/api/weather?city=${city}`);
        const weatherData = await weatherRes.json();

        if (weatherRes.status !== 200) throw new Error(weatherData.error);

        displayWeather(weatherData);

        const newsRes = await fetch(`/api/news?city=${city}`);
        const newsData = await newsRes.json();

        displayNews(newsData);

    } catch (err) {
        console.error(err);
        errorDiv.innerText = "Error fetching data. Please try again.";
        hideSections();
    }
}

function displayWeather(data) {
    const section = document.getElementById('weather-section');
    const details = document.getElementById('weather-details');

    details.innerHTML = `
        <p><strong>Temp:</strong> ${data.temperature}°C (Feels like ${data.feels_like}°C)</p>
        <p><strong>Condition:</strong> ${data.description}</p>
        <p><strong>Wind Speed:</strong> ${data.wind_speed} m/s</p>
        <p><strong>Rain (last 3h):</strong> ${data.rain_3h} mm</p>
        <p><strong>Country:</strong> ${data.country_code}</p>
        <p><strong>Coordinates:</strong> [${data.coordinates.lat}, ${data.coordinates.lon}]</p>
    `;
    section.classList.remove('hidden');
}

function displayNews(articles) {
    const section = document.getElementById('news-section');
    const list = document.getElementById('news-list');

    list.innerHTML = articles.map(article => `
        <li>
            <a href="${article.url}" target="_blank">${article.title}</a>
            <small>(${article.source})</small>
        </li>
    `).join('');

    section.classList.remove('hidden');
}

function hideSections() {
    document.getElementById('weather-section').classList.add('hidden');
    document.getElementById('news-section').classList.add('hidden');
}