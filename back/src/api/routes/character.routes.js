const express = require('express');
const { upload } = require('../../middlewares/characterFiles.middleware');
const {
    createNewCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacterById,
    getAllCharacters,
    movieFilterCharacter
} = require('../controllers/characters.controller');
const { isAuth, isAuthAdmin } = require('../../middlewares/auth.middleware');
const CharacterRoutes = express.Router();

CharacterRoutes.post('/newCharacter', /*[isAuthAdmin],*/ upload.single('image'), createNewCharacter);
CharacterRoutes.patch('/updateCharacter/:id', /*[isAuthAdmin],*/ upload.single('image'), updateCharacter);
CharacterRoutes.delete('/deleteCharacter/:id', /*[isAuthAdmin],*/ deleteCharacter);
CharacterRoutes.get('/:id', getCharacterById);
CharacterRoutes.get('/allCharacters/allCharacters', getAllCharacters);   //? por qué me da un error si solo pongo /allCharacter? si pongo /allCharacters/allCharacters va bien
CharacterRoutes.get('/characterInMovie/:movie', movieFilterCharacter)



module.exports = CharacterRoutes;