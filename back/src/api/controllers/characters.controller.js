const Character = require('../models/character.model');
const User = require('../models/user.model');
const dotenv = require('dotenv');
const setError = require('../../helpers/handle-error');
const { deleteImgCloudinary } = require('../../middlewares/characterFiles.middleware');
dotenv.config()



//! -------------------------------------------------------------------------------------
//? -------------------------- CREATE NEW CHARACTER -------------------------------------
//! -------------------------------------------------------------------------------------

const createNewCharacter = async (req, res, next) => {
    let catchImg = req.file?.path;
    try {
        // Actualizamos los index de los elementos unique
        await Character.syncIndexes();

        // Creamos una nueva instancia de personaje
        const newCharacter = new Character({ ...req.body });

        // Le metemos la imagen
        if (req.file) {
            newCharacter.image = req.file.path;
        } else {
            return next(setError(404, 'Image is not included'));
        };
        
        
        // Comprobamos si el personaje existe en la base de datos o no.
        const characterExist = await Character.findOne({
            name: newCharacter.name,
            description: newCharacter.description
        });

        if (characterExist) {
            deleteImgCloudinary(catchImg);
            return next(setError(409, 'This character already exist in DB'));
        } else {
            const createCharacter = await newCharacter.save();
            return res.status(201).json({
                character: createCharacter
            });
        };

    } catch (error) {
        deleteImgCloudinary(catchImg);
        return next(setError(error.code || 500, error.message || 'Create character failed'));
    };
};

//! ---------------------------------------------------------------------------------
//? -------------------------- UPDATE CHARACTER -------------------------------------
//! ---------------------------------------------------------------------------------

const updateCharacter = async (req, res, next) => {
    let catchImg = req.file?.path;
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Character.syncIndexes();

        const { id } = req.params;
        // Comprobamos que el ID es correcto
        const characterExist = await Character.findById(id);
        if (characterExist) {
            const updateCharacterWithNewInfo = new Character(req.body);
            // Si tenemos la req.file, le metemos el path de cloudinary
            if (req.file) {
                updateCharacterWithNewInfo.image = req.file.path;
            };
            // No quiero que se pueda actualizar el ID
            updateCharacterWithNewInfo._id = characterExist._id;
            updateCharacterWithNewInfo.user = characterExist.user;

            // Actualizamos la DB con el ID y la instancia del modelo de character
            try {
                await Character.findByIdAndUpdate(characterExist, updateCharacterWithNewInfo);
                if (req.file) {
                    deleteImgCloudinary(characterExist.image);
                };

                //! ----------------test  runtime ----------------
                // buscamos el personaje actualizado
                const updateCharacter = await Character.findById(id);
                // cogemos las keys del body
                const updateKeys = Object.keys(req.body);
                
                // creamos una variable para guardar los test
                const testUpdate = [];
                // recorremos las keys y comparamos
                updateKeys.forEach((item) => {
                    // Ponemos item entre [] para que coja cada nombre de la clave concreta en lugar de la palabra 'item'
                    // Ponemos == ya que pueden aparecer numeros que en uno actue como numero y en otro como string (updateCharacter lo pasa a texto plano)
                    if (updateCharacter[item] == req.body[item]) {
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
                    updateCharacter.image == req.file.path
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
            return res.status(400).json('This character ID does not exist.')
        }

    } catch (error) {
        if (req.file) deleteImgCloudinary(catchImg);
        return next(setError(error.code || 500, error.message || 'Update character failed'));
    };
};


//! ---------------------------------------------------------------------------------
//? -------------------------- DELETE CHARACTER -------------------------------------
//! ---------------------------------------------------------------------------------

const deleteCharacter = async (req, res, next) => {
    const { id } = req.params;
    const characterExist = await Character.findById(id);
    const deleteCharacter = await Character.findByIdAndDelete(id)
    try {
        if (deleteCharacter) {
            deleteImgCloudinary(characterExist.image);
            return res.status(200).json('Character deleted from de DB ✅')
        } else {
            return res.status(404).json('Character was not deleted ❌');
        };
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Update character failed'));
    };
};


//! ------------------------------------------------------------------------------------
//? -------------------------- GET CHARACTER BY ID -------------------------------------
//! ------------------------------------------------------------------------------------

const getCharacterById = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        const characterById = await Character.findById(id).populate('user');
        if(characterById) {
            return res.status(200).json(characterById);
        } else {
            return res.status(404).json('We could not find a character with this ID.')
        }
    } catch (error) {
        return next(error);
    }
}


//! -----------------------------------------------------------------------------------
//? -------------------------- GET ALL CHARACTERS -------------------------------------
//! -----------------------------------------------------------------------------------

const getAllCharacters = async (req, res, next) => {
    try {
        const allCharacters = await Character.find().populate('user');
        if (allCharacters) {
            return res.status(200).json(allCharacters);
        } else {
            return res.status(404).json('❌ We could not get all characters. ❌')
        }
    } catch (error) {
        return next(error);
    }
};


//! --------------------------------------------------------------------------------------
//? -------------------------- GET MOVIE CHARACTERS -------------------------------------
//! --------------------------------------------------------------------------------------

const movieFilterCharacter = async (req, res, next) => {
    const { movie } = req.params;
    try {
        const movieCharacters = await Character.find({movie: movie}).populate('user');
        if (movieCharacters) {
            return res.status(200).json(movieCharacters)
        } else {
            return res.status(404).json('We could not found any character for this movie');
        };
    } catch (error) {
        return next(error);
    };
};




module.exports = {
    createNewCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacterById,
    getAllCharacters,
    movieFilterCharacter
};