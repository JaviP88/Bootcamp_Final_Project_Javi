const express = require('express');
const { upload } = require('../../middlewares/movieFiles.middleware');
const {
    createNewMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
    getAllMovies,
    addCharacterToMovie
} = require('../controllers/movies.controller');
const { isAuth, isAuthAdmin } = require('../../middlewares/auth.middleware');
const MovieRoutes = express.Router();

MovieRoutes.post('/newMovie', /*[isAuthAdmin],*/ upload.single('image'), createNewMovie);
MovieRoutes.patch('/updateMovie/:id', /*[isAuthAdmin],*/ upload.single('image'), updateMovie);
MovieRoutes.delete('/deleteMovie/:id', /*[isAuthAdmin],*/ deleteMovie);
MovieRoutes.get('/:id', getMovieById);
MovieRoutes.get('/allMovies/allMovies', getAllMovies);   //? por qué me da un error si solo pongo /allCharacter? si pongo /allCharacters/allCharacters va bien
MovieRoutes.post('/addCharacterToMovie', /*[isAuthAdmin],*/ addCharacterToMovie)


module.exports = MovieRoutes;