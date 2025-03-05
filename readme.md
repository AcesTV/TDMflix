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
