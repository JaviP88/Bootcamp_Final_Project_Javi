const express = require('express');
const { upload } = require('../../middlewares/movieFiles.middleware');
const {
    createNewGallery,
    updateGallery,
    deleteGallery,
    adminDeleteGallery,
    getGalleryById,
    getAllGalleries
} = require('../controllers/galleries.controller');
const { isAuth, isAuthAdmin } = require('../../middlewares/auth.middleware');
const GalleryRoutes = express.Router();

GalleryRoutes.post('/newGallery/:id', [isAuth], upload.single('image'), createNewGallery);
GalleryRoutes.patch('/updateGallery/:id', [isAuth], upload.single('image'), updateGallery);
GalleryRoutes.delete('/deleteGallery/:id', [isAuth], deleteGallery);
GalleryRoutes.delete('/adminDeleteGallery/:id', [isAuthAdmin], adminDeleteGallery);
GalleryRoutes.get('/:id', getGalleryById);
GalleryRoutes.get('/allGalleries/allGalleries', getAllGalleries);   //? por qué me da un error si solo pongo /allCharacter? si pongo /allCharacters/allCharacters va bien


module.exports = GalleryRoutes;