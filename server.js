const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('Front-end'));

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const weatherData = {
            temperature: data.main.temp,
            description: data.weather[0].description,
            coordinates: data.coord,
            feels_like: data.main.feels_like,
            wind_speed: data.wind.speed,
            country_code: data.sys.country,
            rain_3h: data.rain ? data.rain['3h'] || 0 : 0
        };

        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data. Check city name." });
    }
});

app.get('/api/news', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/everything?q=${city}&pageSize=3&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const newsData = response.data.articles.map(article => ({
            title: article.title,
            url: article.url,
            source: article.source.name
        }));

        res.json(newsData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch news." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});