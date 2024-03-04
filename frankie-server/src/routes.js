const { Router } = require('express');
// const AlexaController = require('./controllers/AlexaController');
// const MoviesController = require('./controllers/MoviesController');
// const SeriesController = require('./controllers/SeriesController');
// const BooksController = require('./controllers/BooksController');
const GamesController = require('./controllers/GamesController');

const routes = Router();
  
routes.get('/games', GamesController.get);
routes.get('/games/search', GamesController.search);
routes.post('/games', GamesController.post);

// routes.get('/movies/genres', MoviesController.getGenres);
// routes.get('/movies', MoviesController.get);
// routes.get('/movies/search', MoviesController.search);
// routes.get('/games/genres', GamesController.getGenres);
// routes.post('/movies', MoviesController.post);
// routes.put('/movies', MoviesController.put);

// routes.get('/series', SeriesController.get);
// routes.get('/series/search', SeriesController.search);
// routes.get('/series/genres', SeriesController.getGenres);
// routes.post('/series', SeriesController.post);

// routes.get('/games/screenshots', GamesController.getGameScreenshots);

// routes.get('/alexa/say', AlexaController.say);
// routes.get('/alexa/make', AlexaController.make);
// routes.get('/alexa', AlexaController.get);

// routes.get('/books', BooksController.get);
// routes.post('/books', BooksController.post);
// routes.put('/books', BooksController.put);

module.exports = routes;