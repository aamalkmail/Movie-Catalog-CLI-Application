const readlineSync = require('readline-sync');

class Movie {
    constructor(title, director, releaseYear, genre) {
        this.title = title;
        this.director = director;
        this.releaseYear = releaseYear;
        this.genre = genre;
    }
    static createMovie() {
        const title = readlineSync.question('Title: ');
        const director = readlineSync.question('Director: ');
        const releaseYear = readlineSync.question('Release Year: ');
        const genre = readlineSync.question('Genre: ');
        return new Movie(title, director, releaseYear, genre);
    }

}

module.exports = Movie;
