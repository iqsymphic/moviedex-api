// env on top, all the requirements listed

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const MOVIES = require("./movies-data-small.json");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

//this is correct way, don't forget [1], that is what caused error

app.use(function validateBearerToken(req, res, next) {
  const apiTOKEN = process.env.API_TOKEN;
  const authTOKEN = req.get("Authorization");
  if (!authTOKEN || authTOKEN.split(" ")[1] !== apiTOKEN) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

app.get("/movie", function handleGetMOVIE(req, res) {
  let response = MOVIES;

  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  //remember its compare here, no search for case or anything

  if (req.query.avg_vote) {
    response = response.filter(
      movie => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
