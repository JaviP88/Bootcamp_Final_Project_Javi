const Movie = require('../models/movie.model');
const Character = require('../models/character.model');
const dotenv = require('dotenv');
const setError = require('../../helpers/handle-error');
const { deleteImgCloudinary } = require('../../middlewares/movieFiles.middleware');
dotenv.config()



//! ---------------------------------------------------------------------------------
//? -------------------------- CREATE NEW MOVIE -------------------------------------
//! ---------------------------------------------------------------------------------

const createNewMovie = async (req, res, next) => {
    let catchImg = req.file?.path;
    try {
        // Actualizamos los index de los elementos unique
        await Movie.syncIndexes();

        // Creamos una nueva instancia de personaje
        const newMovie = new Movie({ ...req.body });

        // Le metemos la imagen
        if (req.file) {
            newMovie.image = req.file.path;
        } else {
            return next(setError(404, 'Image is not included'));
        };
        
        
        // Comprobamos si el personaje existe en la base de datos o no.
        const movieExist = await Movie.findOne({
            name: newMovie.name,
            description: newMovie.description
        });

        if (movieExist) {
            deleteImgCloudinary(catchImg);
            return next(setError(409, 'This movie already exist in DB'));
        } else {
            const createMovie = await newMovie.save();
            return res.status(201).json({
                movie: createMovie
            });
        };

    } catch (error) {
        deleteImgCloudinary(catchImg);
        return next(setError(error.code || 500, error.message || 'Create movie failed'));
    };
};


//! -----------------------------------------------------------------------------
//? -------------------------- UPDATE MOVIE -------------------------------------
//! -----------------------------------------------------------------------------

const updateMovie = async (req, res, next) => {
    let catchImg = req.file?.path;
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Movie.syncIndexes();

        const { id } = req.params;
        // Comprobamos que el ID es correcto
        const movieExist = await Movie.findById(id);
        if (movieExist) {
            const updateMovieWithNewInfo = new Movie(req.body);
            // Si tenemos la req.file, le metemos el path de cloudinary
            if (req.file) {
                updateMovieWithNewInfo.image = req.file.path;
            };
            // No quiero que se pueda actualizar el ID
            updateMovieWithNewInfo._id = movieExist._id;
            updateMovieWithNewInfo.user = movieExist.user;

            // Actualizamos la DB con el ID y la instancia del modelo de movie
            try {
                await Movie.findByIdAndUpdate(movieExist, updateMovieWithNewInfo);
                if (req.file) {
                    deleteImgCloudinary(movieExist.image);
                };

                //! ----------------test  runtime ----------------
                // buscamos la pelicula actualizada
                const updateMovie = await Movie.findById(id);
                // cogemos las keys del body
                const updateKeys = Object.keys(req.body);
                
                // creamos una variable para guardar los test
                const testUpdate = [];
                // recorremos las keys y comparamos
                updateKeys.forEach((item) => {
                    // Ponemos item entre [] para que coja cada nombre de la clave concreta en lugar de la palabra 'item'
                    // Ponemos == ya que pueden aparecer numeros que en uno actue como numero y en otro como string (updateCharacter lo pasa a texto plano)
                    if (updateMovie[item] == req.body[item]) {
                        testUpdate.push({
                            [item]: true
                        });
                    } else {
                        testUpdate.push({
                            [item]: false
                        });
                    };
                });
                //Ahora comparamos la imagen a ver si se ha actualizado
                if (req.file) {
                    updateMovie.image == req.file.path
                    ? testUpdate.push({
                        file: true
                    })
                    : testUpdate.push({
                        file: false
                    });
                };
                return res.status(200).json({
                    testUpdate
                });
            } catch (error) {
                return res.status(404).json(error.message);
            };
        } else {
            if (req.file) deleteImgCloudinary(catchImg)
            return res.status(400).json('This movie ID does not exist.')
        }

    } catch (error) {
        if (req.file) deleteImgCloudinary(catchImg);
        return next(setError(error.code || 500, error.message || 'Update movie failed'));
    };
};


//! -----------------------------------------------------------------------------
//? -------------------------- DELETE MOVIE -------------------------------------
//! -----------------------------------------------------------------------------

const deleteMovie = async (req, res, next) => {
    const { id } = req.params;
    const movieExist = await Movie.findById(id);
    const deleteMovie = await Movie.findByIdAndDelete(id)
    try {
        if (deleteMovie) {
            deleteImgCloudinary(movieExist.image);
            return res.status(200).json('Movie deleted from de DB ✅')
        } else {
            return res.status(404).json('Movie was not deleted ❌');
        };
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Delete movie failed'));
    };
};

//! --------------------------------------------------------------------------------
//? -------------------------- GET MOVIE BY ID -------------------------------------
//! --------------------------------------------------------------------------------

const getMovieById = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        const movieById = await Movie.findById(id).populate('user movieComments movieCharacters');
        if(movieById) {
            return res.status(200).json(movieById);
        } else {
            return res.status(404).json('We could not find a movie with this ID.')
        }
    } catch (error) {
        return next(error);
    }
}


//! -------------------------------------------------------------------------------
//? -------------------------- GET ALL MOVIES -------------------------------------
//! -------------------------------------------------------------------------------

const getAllMovies = async (req, res, next) => {
    try {
        const allMovies = await Movie.find().populate('user movieComments movieCharacters');
        if (allMovies) {
            return res.status(200).json(allMovies);
        } else {
            return res.status(404).json('❌ We could not get all movies. ❌')
        }
    } catch (error) {
        return next(error);
    }
};


//! -----------------------------------------------------------------------------
//? -------------------- ADD/DELETE CHARACTER TO A MOVIE ------------------------
//! -----------------------------------------------------------------------------

const addCharacterToMovie = async (req, res, next) => {
    try {
        // Sacamos el ID de la pelicula y del personaje que queremos incluir dentro
        const { movieId, characterIdToAdd } = req.body;       // hay que meterle el id de movie por param o por body (es mejor meterlo por body ya que es más dificil de interceptar)
        // Actualizamos los indexes
        await Movie.syncIndexes();
        await Character.syncIndexes();
        try {
            const movie = await Movie.findById(movieId);
            const character = await Character.findById(characterIdToAdd);

            if (movie == null && character == null) {
                return res.status(404).json('Movie ID and character ID are not found in our DB.');
            } else if (movie == null){
                return res.status(404).json('Movie ID not found in our DB.')
            } else if (character == null) {
                return res.status(404).json('Character ID not found in our DB.')
            } else {
                if (!movie.movieCharacters.includes(characterIdToAdd)) {
                    await movie.updateOne({ $push: { movieCharacters: characterIdToAdd } });
                    await character.updateOne({ $push: { movie: movieId } });
    
                    res.status(200).json('The character has been added to this movie');
                } else {
                    await movie.updateOne({ $pull: { movieCharacters: characterIdToAdd } });
                    await character.updateOne({ $pull: { movie: movieId } })
    
                    res.status(200).json('The character has been deleted to this movie');
                }
            }  
        } catch (err) {
            res.status(404).json(err.message);
        }
    } catch (error) {
        return next(500 || error.message);
    }
};




module.exports = {
    createNewMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
    getAllMovies,
    addCharacterToMovie
};