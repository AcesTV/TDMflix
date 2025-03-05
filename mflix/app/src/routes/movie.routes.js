import express from 'express';
import movieController from '../controllers/movie.controller.js';

const router = express.Router();
//Etape 1
router.get('/count-movies', movieController.countMovies);
router.get('/count-series', movieController.countSeries);
router.get('/content-types', movieController.getContentTypes);
router.get('/genres', movieController.getGenres);
router.get('/movies-from-2015', movieController.getMoviesFrom2015);
router.get('/movies-from-2015-with-5-awards', movieController.getMoviesFrom2015With5Awards);
router.get('/french-movies-from-2015-with-5-awards', movieController.getFrenchMoviesFrom2015With5Awards);
router.get('/movies-with-genre-thriller-and-drama', movieController.getMoviesWithGenreThrillerAndDrama);
router.get('/movies-with-genre-crime-or-thriller', movieController.getMoviesWithGenreCrimeOrThriller);
router.get('/movies-with-genre-french-and-italian', movieController.getMoviesWithGenreFrenchAndItalian);
router.get('/movies-with-genre-and-imdb-score', movieController.getMoviesWithGenreAndIMDBScore);
router.get('/movies-with-4-actors', movieController.getMoviesWith4Actors);

//Etape 2
router.get('/movies-stats', movieController.getMoviesStats);
router.get('/movies-cast-total', movieController.getMoviesCastTotal);
router.get('/movies-only-cast-total', movieController.getMoviesOnlyCastTotal);
router.get('/movies-hollywood-count', movieController.getMoviesHollywoodCount);
router.get('/movies-between-2000-and-2010-with-8-imdb-and-10-awards', movieController.getMoviesBetween2000And2010With8IMDBAnd10Awards);
router.get('/5-best-movies-with-4-actors-and-15-awards-and-imdb-score', movieController.get5BestMoviesWith4ActorsAnd15AwardsAndIMDBScore);

router.post('/', movieController.create);
router.get('/', movieController.findAll);
router.get('/search', movieController.search);
router.get('/:id', movieController.findOne);
router.put('/:id', movieController.update);
router.delete('/:id', movieController.deleteMovie);

export default router;
