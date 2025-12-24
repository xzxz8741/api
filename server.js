const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public'));

const PORT = 3000;


async function getCountryInfo(country) {
  const response = await axios.get(
    `https://restcountries.com/v3.1/name/${country}`
  );

  const data = response.data[0];

  return {
    name: data.name.common,
    capital: data.capital?.[0] || 'Not available',
    languages: data.languages
      ? Object.values(data.languages).join(', ')
      : 'Not available',
    currency: data.currencies
      ? Object.keys(data.currencies)[0]
      : 'Not available',
    flag: data.flags.png
  };
}



async function getExchangeRates(currency) {
  const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${currency}`
  );

  return {
    USD: response.data.conversion_rates.USD,
    KZT: response.data.conversion_rates.KZT
  };
}


async function getNews(country) {
  const response = await axios.get(
    `https://newsapi.org/v2/everything?q=${country}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`
  );

  return response.data.articles.map(article => ({
    title: article.title,
    description: article.description,
    image: article.urlToImage,
    url: article.url
  }));
}


app.get('/api/user', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    const user = response.data.results[0];

    const cleanUser = {
      firstName: user.name.first,
      lastName: user.name.last,
      gender: user.gender,
      age: user.dob.age,
      dob: user.dob.date,
      picture: user.picture.large,
      city: user.location.city,
      country: user.location.country,
      address: `${user.location.street.name} ${user.location.street.number}`
    };

    const countryInfo = await getCountryInfo(cleanUser.country);

    const rates = countryInfo.currency !== 'Not available'
      ? await getExchangeRates(countryInfo.currency)
      : { USD: 'N/A', KZT: 'N/A' };

    const news = await getNews(cleanUser.country);

    res.json({
      user: cleanUser,
      country: countryInfo,
      exchange: rates,
      news: news
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
