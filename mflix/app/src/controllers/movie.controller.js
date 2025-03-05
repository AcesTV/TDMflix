import Movie from '../models/movie.model.js';

// Etape 1

async function countMovies(req, res) {
  const count = await Movie.countDocuments({ type: "movie" });
  res.json({ count });
}

async function countSeries(req, res) {
  const count = await Movie.countDocuments({ type: "series" });
  res.json({ count });
}

// Obtenez les 2 différents types de contenu présents dans la collection movies (cf. attribut type)
async function getContentTypes(req, res) {
  const types = await Movie.distinct("type");
  res.json({ types });
}

// Obtenez la liste des genres de contenus disponibles dans la collection movies.
async function getGenres(req, res) {
  const genres = await Movie.distinct("genres");
  res.json({ genres });
}

// Récupérez les films depuis 2015 classés par ordre décroissant
async function getMoviesFrom2015(req, res) {
  const movies = await Movie.find({ year: { $gte: 2015 } }).sort({ year: -1 });
  res.json({ movies });
}

// Obtenez le nombre de films sortis depuis 2015 ayant remporté au moins 5 récompenses dans tomatoes awards wins
async function getMoviesFrom2015With5Awards(req, res) {
  try {
    const movies = await Movie.aggregate([
        {
            $match: {
                year: { $gte: 2015 },
                'awards.wins': { $gte: 5 }
            }
        }
    ]).countDocuments();
    res.json({ 
      count: movies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Parmi ces films, indiquez le nombre de films disponibles en français ?
async function getFrenchMoviesFrom2015With5Awards(req, res) {
  try {
    const movies = await Movie.aggregate([
        {
            $match: {
                year: { $gte: 2015 },
                'awards.wins': { $gte: 5 },
                languages: "French"
            }
        }
    ]).countDocuments();
    res.json({ 
      count: movies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Sélectionnez les films dont le genre est Thriller et Drama. Indiquez leur nombre. Il faut que les films possèdent les deux genres.
async function getMoviesWithGenreThrillerAndDrama(req, res) {
  const movies = await Movie.find({ genres: { $all: ["Thriller", "Drama"] } }).countDocuments();
  res.json({ count: movies, movies });
}

// Sélectionnez le titre et les genres des films dont le genre est Crime ou Thriller
async function getMoviesWithGenreCrimeOrThriller(req, res) {
  const movies = await Movie.find({ genres: { $in: ["Crime", "Thriller"] } }).select("title genres");
  res.json({ count: movies.length, movies });
}


// Sélectionnez le titre et les langues des films disponibles en français et en italien.
async function getMoviesWithGenreFrenchAndItalian(req, res) {
  const movies = await Movie.find({ languages: { $all: ["French", "Italian"] } }).select("title languages");
  res.json({ count: movies.length, movies });
}

// Sélectionnez le titre et le genre des films dont la note d'IMDB est supérieure à 9
async function getMoviesWithGenreAndIMDBScore(req, res) {
  const movies = await Movie.find({ "imdb.rating" : { $gt: 9 } }).select("title genres");
  res.json({ count: movies.length, movies });
}

// Affichez le nombre de contenus dont le nombre d'acteurs au casting est égal à 4.
async function getMoviesWith4Actors(req, res) {
  const movies = await Movie.find({ cast: { $size: 4 } }).countDocuments();
  res.json({ movies });
}

// Etape 2

// Affichez le nombre de contenus, le nombre total de récompenses, le nombre moyen de nominations et le nombre moyen de récompenses pour l'ensemble des contenus de la collection movies.

async function getMoviesStats(req, res) {
  const stats = await Movie.aggregate([
    {
      $group: {
        _id: null,
        totalContents: { $sum: 1 },
        totalAwards: { $sum: "$awards.wins" },
        averageNominations: { $avg: "$awards.nominations" },
        averageAwards: { $avg: "$awards.wins" }
      }
    }
  ]);
  res.json({ stats });
}


// Affichez le nombre d'acteurs au casting (castTotal) pour chaque contenu
async function getMoviesCastTotal(req, res) {
  const stats = await Movie.aggregate([{
    "$addFields": {
      "castTotal": { "$size": { "$ifNull": ["$cast", []] } }
    }
  }]);
  res.json({ stats });
}

// Affichez seulement le nombre d'acteurs au casting (castTotal) pour chaque contenu.
async function getMoviesOnlyCastTotal(req, res) {
  const stats = await Movie.aggregate([{
    "$project": {
        "title": 1,
        "castTotal": { "$size": { "$ifNull": ["$cast", []] } }
    }
  }]);
  res.json({ stats });
}

// Calculez le nombre de fois que le terme "Hollywood" apparaît dans le résumé des contenus (cf. attribut fullplot)

async function getMoviesHollywoodCount(req, res) {
    const count = await Movie.aggregate([
        {
            "$group": {
              "_id": null,
              "hollywoodCount": {
                "$sum": {
                  "$size": {
                    "$regexFindAll": { "input": "$fullplot", "regex": "Hollywood", "options": "i" }
                  }
                }
              }
            }
          }          
    ]);
    res.json({ count });
}

// Trouvez les films sortis entre 2000 et 2010 qui ont une note IMDB supérieure à 8 et plus de 10 récompenses.

async function getMoviesBetween2000And2010With8IMDBAnd10Awards(req, res) {
  const movies = await Movie.find({
    year: { $gte: 2000, $lte: 2010 },
    "imdb.rating": { $gt: 8 },
    "awards.wins": { $gt: 10 }
  });
  res.json({ count: movies.length, movies });
}

// Quels sont les 5 films les mieux notés sur IMDB, sortis après 1990, qui ont remporté au moins 15 récompenses et dont le casting contient au moins 4 acteurs ?

async function get5BestMoviesWith4ActorsAnd15AwardsAndIMDBScore(req, res) {
    const movies = await Movie.aggregate([
        {
          "$match": {
            "year": { "$gte": 1990 },
            "awards.wins": { "$gte": 15 },
            "imdb.rating": { "$exists": true },
            "$expr": { 
              "$gte": [{ "$size": { "$ifNull": ["$cast", []] } }, 4]
            }
          }
        },
        {
          "$project": {
            "title": 1,
            "year": 1,
            "imdb.rating": 1,
            "awards.wins": 1,
            "castTotal": { "$size": { "$ifNull": ["$cast", []] } },
            "_id": 0
          }
        },
        {
          "$sort": { "imdb.rating": -1 }
        },
        {
          "$limit": 5
        }
      ])
    res.json({ count: movies.length, movies });
}

export default {
  countMovies,
  countSeries,
  getContentTypes,
  getGenres,
  getMoviesFrom2015,
  getMoviesFrom2015With5Awards,
  getFrenchMoviesFrom2015With5Awards,
  getMoviesWithGenreThrillerAndDrama,
  getMoviesWithGenreCrimeOrThriller,
  getMoviesWithGenreFrenchAndItalian,
  getMoviesWithGenreAndIMDBScore,
  getMoviesWith4Actors,
  getMoviesStats,
  getMoviesCastTotal,
  getMoviesOnlyCastTotal,
  getMoviesHollywoodCount,
  getMoviesBetween2000And2010With8IMDBAnd10Awards,
  get5BestMoviesWith4ActorsAnd15AwardsAndIMDBScore
};