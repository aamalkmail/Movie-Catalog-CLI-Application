const readlineSync = require('readline-sync');
const { readMovies, writeMovies } = require('./modules/file');
const { fetchMovies } = require('./modules/api');
const Movie = require('./modules/movie');

const displayMenu = () => {
    console.log('Movie Catalog CLI');
    console.log('1. Display Movie Catalog');
    console.log('2. Add New Movie');
    console.log('3. Update Movie Details');
    console.log('4. Delete Movie');
    console.log('5. Search Movies');
    console.log('6. Filter Movies');
    console.log('7. Fetch Movie Data');
    console.log('0. Exit');
    console.log('');
};

const displayMovieCatalog = () => {
    const movies = readMovies();
    if (movies.length === 0) {
        console.log('The movie catalog is empty.');
    } else {
        console.log('Movie Catalog:');
        movies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.title}`);
        });
    }
};

const addNewMovie = () => {
    const movie = Movie.createMovie();
    const movies = readMovies();
    movies.push(movie);
    writeMovies(movies);
};

const updateMovieDetails = () => {
    const movies = readMovies();
    if (movies.length === 0) {
        console.log('The movie catalog is empty.');
        return;
    }
    displayMovieCatalog();
    const movieIndex = readlineSync.questionInt('Enter the index of the movie to update: ') - 1;
    if (movieIndex < 0 || movieIndex >= movies.length) {
        console.log('Invalid movie index.');
        return;
    }
    const movie = movies[movieIndex];
    console.log('\nExisting Details:');
    console.log(`Title: ${movie.title}`);
    console.log(`Director: ${movie.director}`);
    console.log(`Release Year: ${movie.releaseYear}`);
    console.log(`Genre: ${movie.genre}`);
    console.log('\nEnter new details:');
    const updatedMovie = Movie.createMovie();


    movie.title = updatedMovie.title || movie.title;
    movie.director = updatedMovie.director || movie.director;
    movie.releaseYear = updatedMovie.releaseYear || movie.releaseYear;
    movie.genre = updatedMovie.genre || movie.genre;
    writeMovies(movies);
    console.log('\nMovie details updated successfully.');
};

const deleteMovie = () => {
    const movies = readMovies();
    if (movies.length === 0) {
        console.log('The movie catalog is empty.');
        return;
    }
    displayMovieCatalog();
    const movieIndex = readlineSync.questionInt('Enter the index of the movie to delete: ') - 1;
    if (movieIndex < 0 || movieIndex >= movies.length) {
        console.log('Invalid movie index.');
        return;
    }
    const deletedMovie = movies.splice(movieIndex, 1)[0];
    writeMovies(movies);
    console.log(`\nMovie "${deletedMovie.title}" has been deleted from the catalog.`);
};

const searchMovies = () => {
    const movies = readMovies();
    if (movies.length === 0) {
        console.log('The movie catalog is empty.');
        return;
    }
    const searchQuery = readlineSync.question('Enter a title, director, or genre to search: ');
    const filteredMovies = movies.filter((movie) => {
        const { title, director, genre } = movie;
        return (
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            director.toLowerCase().includes(searchQuery.toLowerCase()) ||
            genre.toLowerCase().includes(searchQuery.toLowerCase())
        );
   
    });
    if (filteredMovies.length === 0) {
        console.log('No movies found matching the search query.');
    } else {
        console.log(`\nSearch Results (${filteredMovies.length} movies found):`);
        filteredMovies.forEach((movie) => {
            console.log(`Title: ${movie.title}`);
            console.log(`Director: ${movie.director}`);
            console.log(`Release Year: ${movie.releaseYear}`);
            console.log(`Genre: ${movie.genre}`);
        });
    }
};

const filterMovies = () => {
    const movies = readMovies();
    if (movies.length === 0) {
        console.log('The movie catalog is empty.');
        return;
    }
    const genreFilter = readlineSync.question('Enter the genre to filter by: ');
    const yearFilter = readlineSync.question('Enter the release year to filter by: ');

    const filteredMovies = movies.filter((movie) => {
        const { genre, releaseYear } = movie;
        return (
            genre.toLowerCase().includes(genreFilter.toLowerCase()) &&
            releaseYear.toString().includes(yearFilter)
        );
    });

    if (filteredMovies.length === 0) {
        console.log('No movies found matching the filter criteria.');
    } else {
        console.log(`\nFiltered Results (${filteredMovies.length} movies found):`);
        filteredMovies.forEach((movie) => {
            console.log(`Title: ${movie.title}`);
            console.log(`Director: ${movie.director}`);
            console.log(`Release Year: ${movie.releaseYear}`);
            console.log(`Genre: ${movie.genre}`);
        });
    }
};

const fetchMovieData = async () => {
    try {
        const movies = await fetchMovies();
        if (movies.length === 0) {
            console.log('No movies found with the given IMDb ID.');
            return;
        }
        console.log(`\nMovie Details:`);
        const movie = movies[0];
        console.log(`Title: ${movie.Title}`);
        console.log(`Director: ${movie.Director}`);
        console.log(`Release Year: ${movie.Year}`);
        console.log(`Genre: ${movie.Genre}`);

        const shouldSave = readlineSync.keyInYN('Do you want to save the fetched movie to the catalog? ');
        if (shouldSave) {
            const movieObj = new Movie(movie.Title, movie.Director, movie.Year, movie.Genre);
            const movies = readMovies();
            movies.push(movieObj);
            writeMovies(movies);
            console.log('Movie saved to catalog successfully.');
        }
    } catch (error) {
        console.log('An error occurred while fetching movie data:', error.message);
    }
};

const main = async () => {
    let choice;
    while (choice !== '0') {
        displayMenu();
        choice = readlineSync.question('Enter your choice: ');
        console.log('');

        switch (choice) {
            case '1':
                displayMovieCatalog();
                break;
            case '2':
                addNewMovie();
                break;
            case '3':
                updateMovieDetails();
                break;
            case '4':
                deleteMovie();
                break;
            case '5':
                searchMovies();
                break;
            case '6':
                filterMovies();
                break;
            case '7':
                await fetchMovieData();
                break;
            case '0':
                console.log('Exiting the program...');
                break;
            default:
                console.log('Invalid choice. Please try again.');
        }
        console.log('');

        if (choice === '7') {
            await new Promise((resolve) => {
                readlineSync.question('Press Enter to continue...');
                resolve();
            });
        }
    }
};

main().catch((error) => {
    console.error('An error occurred:', error);
});
