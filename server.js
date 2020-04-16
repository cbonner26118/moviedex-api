require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const movies = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  next();
});

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  const filteredGenres = movies.filter((item) => {
    if (genre) {
      return item.genre.toLowerCase().includes(genre.toLowerCase());
    }
    return true;
  });

  const filteredCountry = filteredGenres.filter((item) => {
    if (country) {
      return item.country
        .toLowerCase()
        .includes(country.toLowerCase());
    }
    return true;
  });

  const filteredAvgVote = filteredCountry.filter((item) => {
    if (avg_vote) {
      return item.avg_vote >= avg_vote;
    }
    return true;
  });
  res.status(200).json(filteredAvgVote);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
