# BREANT Nicolas - MAALSI24-2

## Mflix Etape 1

### 1.1

Nombre total de films: 23285

```javascript
const count = await Movie.countDocuments({ type: "movie" });
```

### 1.2

Nombre total de séries: 254

```javascript
const count = await Movie.countDocuments({ type: "series" });
```

### 1.3

Types de contenu: Movie et Series

```javascript
const types = await Movie.distinct("type");
```


### 1.4

Liste des genres: 
- Action
- Adventure
- Animation
- Biography
- Comedy
- Crime
- Documentary
- Drama
- Family
- Fantasy
- Film-Noir
- History
- Horror
- Music 
- Musical
- Mystery
- News
- Romance
- Sci-Fi
- Short
- Sport
- Talk-Show
- Thriller
- War
- Western


```javascript
const genres = await Movie.distinct("genres");
```

### 1.5

Liste des films sortis depuis 2015 classés par ordre décroissant:

```javascript
const movies = await Movie.find({ year: { $gte: 2015 } }).sort({ year: -1 });
```

### 1.6

Nombre de films sortis depuis 2015 ayant remporté au moins 5 récompenses: 34

```javascript
const movies = await Movie.aggregate([
        {
            $match: {
                year: { $gte: 2015 },
                'awards.wins': { $gte: 5 }
            }
        }
    ]);
```

### 1.7

Nombre de films sortis depuis 2015 ayant remporté au moins 5 récompenses et disponibles en français: 1

```javascript
const movies = await Movie.aggregate([
        {
            $match: {
                year: { $gte: 2015 },
                'awards.wins': { $gte: 5 },
                languages: "French"
            }
        }
    ]);
```

### 1.8

Nombre de films ayant le genre thriller et drama: 1245

```javascript
const movies = await Movie.find({ genres: { $all: ["Thriller", "Drama"] } }).countDocuments();
```

### 1.9

Liste des films ayant le genre crime ou thriller: 4712

```javascript
const movies = await Movie.find({ genres: { $in: ["Crime", "Thriller"] } }).select("title genres");
```


### 1.10

Liste des films disponibles en français et en italien: 299

```javascript
const movies = await Movie.find({ languages: { $all: ["French", "Italian"] } }).select("title languages");
```

### 1.11

Liste des films dont la note d'IMDB est supérieure à 9: 20

```javascript
const movies = await Movie.find({ "imdb.rating" : { $gt: 9 } }).select("title genres");
```

### 1.12

Nombre de films dont le nombre d'acteurs au casting est égal à 4: 22389

```javascript
const movies = await Movie.find({ cast: { $size: 4 } }).countDocuments();
```

## Etape 2

### 2.13

Affichez le nombre de contenus, le nombre total de récompenses, le nombre moyen de nominations et le nombre moyen de récompenses pour l'ensemble des contenus de la collection movies.

```javascript
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
```

### 2.14

Affichez le nombre d'acteurs au casting (castTotal) pour chaque contenu. En l'ajoutant en tant que champ supplémentaire dans la collection movies.

```javascript
const stats = await Movie.aggregate([{
  "$addFields": {
    "castTotal": { "$size": { "$ifNull": ["$cast", []] } }
  }
}]);
```

Affichez seulement le nombre d'acteurs au casting (castTotal) pour chaque contenu.

```javascript
const stats = await Movie.aggregate([{
    "$project": {
        "title": 1,
        "castTotal": { "$size": { "$ifNull": ["$cast", []] } }
    }
  }]);
```

### 2.15

Calculez le nombre de fois que le terme "Hollywood" apparaît dans le résumé des contenus (cf. attribut fullplot)

```javascript
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
```

### 2.16

Trouvez les films sortis entre 2000 et 2010 qui ont une note IMDB supérieure à 8 et plus de 10 récompenses.

```javascript
const movies = await Movie.find({
    year: { $gte: 2000, $lte: 2010 },
    "imdb.rating": { $gt: 8 },
    "awards.wins": { $gt: 10 }
  });
```

### 2.17

Proposez une nouvelle question complexe et fournissez la solution pour y répondre
ainsi que la réponse

#### Quels sont les 5 films les mieux notés sur IMDB, sortis après 1990, qui ont remporté au moins 15 récompenses et dont le casting contient au moins 4 acteurs ?

Réponse:
- Band of Brothers (2001, 9.6, 34 récompenses, 4 acteurs) 
- The Shawshank Redemption (1994, 9.3, 23 récompenses, 4 acteurs)
- The Shawshank Redemption (1994, 9.3, 23 récompenses, 4 acteurs)
- The Dark Knight (2008, 9.0, 144 récompenses, 4 acteurs)
- The Lord of the Rings: The Return of the King (2003, 8.9, 175 récompenses, 4 acteurs)

```javascript
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
```