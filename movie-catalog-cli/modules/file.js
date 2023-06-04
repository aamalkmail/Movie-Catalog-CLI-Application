const fs = require('fs');
const path = require('path');

const dataDirectory = path.join(__dirname, '..', 'data');
const moviesFilePath = path.join(dataDirectory, 'movies.json');

const readMovies = () => {
    try {
        const moviesData = fs.readFileSync(moviesFilePath, 'utf-8');
        return JSON.parse(moviesData);
    } catch (error) {
        console.error('Error reading movies file:', error);
        return [];
    }
};

const writeMovies = (movies) => {
    try {
        fs.writeFileSync(moviesFilePath, JSON.stringify(movies, null, 2));
        console.log('Movies data saved successfully.');
    } catch (error) {
        console.error('Error writing movies file:', error);
    }
};

module.exports = {
    readMovies,
    writeMovies,
};
