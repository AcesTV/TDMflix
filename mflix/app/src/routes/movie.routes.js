import express from 'express';
import movieController from '../controllers/movie.controller.js';

const router = express.Router();

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

router.post('/', movieController.create);
router.get('/', movieController.findAll);
router.get('/search', movieController.search);
router.get('/:id', movieController.findOne);
router.put('/:id', movieController.update);
router.delete('/:id', movieController.deleteMovie);

export default router;
