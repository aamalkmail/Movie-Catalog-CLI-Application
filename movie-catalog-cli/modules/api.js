const fetch = require('isomorphic-fetch');

const fetchMovies = async () => {
    const imdbID = 'tt3896198'; // IMDb ID of the movie
    const apiKey = '773b08a1'; // API key 
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.Response === 'True') {
            return [data];
        } else {
            throw new Error(data.Error || 'Failed to fetch movies.');
        }
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        return [];
    }
};

module.exports = {
    fetchMovies,
};
