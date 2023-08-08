const Gallery = require('../models/gallery.model');
const User = require('../models/user.model');
const Character = require('../models/character.model');
const dotenv = require('dotenv');
const setError = require('../../helpers/handle-error');
const { deleteImgCloudinary } = require('../../middlewares/galleryFiles.middleware');
dotenv.config()



//! -----------------------------------------------------------------------------------
//? -------------------------- CREATE NEW GALLERY -------------------------------------
//! -----------------------------------------------------------------------------------

const createNewGallery = async (req, res, next) => {
    let catchImg = req.file?.path;
    try {
        // Sacamos el ID del usuario que va a subir la galeria.
        const { _id } = req.user;
        // Y el ID del personaje al que vamos a añadir la galleria
        const characterId = req.params.id;
        // Actualizamos los indexes
        await Character.syncIndexes();

        try {
            const user = await User.findById(_id);
            const character = await Character.findById (characterId);
            
            if (user != null) {
                // Creamos una nueva instancia de comentario
                const newGallery = new Gallery({ ...req.body });

                // Le metemos la imagen
                if (req.file) {
                    newGallery.image = req.file.path;
                } else {
                    return next(setError(404, 'Image is not included'));
                };
                        
                if (character != null) {
                    const createGallery = await newGallery.save();
                    
                    await user.updateOne({ $push: { characterImagesUpload: createGallery._id } });
                    await character.updateOne({ $push: { characterGallery: createGallery._id } });
                    await createGallery.updateOne({ $push: { user: user._id } });
                    await createGallery.updateOne({ $push: { character: character._id } });
                    
                    return res.status(201).json({
                        image: createGallery
                    });    
                }  else {
                    deleteImgCloudinary(catchImg);
                    return res.status(404).json('We could not found Character ID in DB')
                };
            } else {
                return res.status(404).json('To add a gallery must be a registered user.');
            };

        } catch (error) {
            return res.status(500).json(error.message)
        };
        
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Create gallery failed.'));
    };
};



//! -------------------------------------------------------------------------------
//? -------------------------- UPDATE GALLERY -------------------------------------
//! -------------------------------------------------------------------------------

const updateGallery = async (req, res, next) => {
    let catchImg = req.file?.path;
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Gallery.syncIndexes();

        const { _id } = req.user;
        const { id } = req.params;

        // Comprobamos que el user y la galeria  existen y es el que ha puesto la galeria, si no lo ha puesto, no puede modificarlo.
        const user = await User.findById(_id);
        const galleryExist = await Gallery.findById(id);

        if (user != null && galleryExist != null) {
            if (user.characterImagesUpload.includes(id)) {
                const updateGalleryWithNewInfo = new Gallery(req.body);
                // Si tenemos la req.file, le metemos el path de cloudinary
                if (req.file) {
                    updateGalleryWithNewInfo.image = req.file.path;
                } else {
                    return next(setError(404, 'Image is not included'));
                };
                // No quiero que se pueda actualizar estas cosas
                updateGalleryWithNewInfo._id = galleryExist._id;
                updateGalleryWithNewInfo.user = galleryExist.user;
                updateGalleryWithNewInfo.character = galleryExist.character;


                // Actualizamos la DB con el ID y la instancia del modelo de gallery
                try {
                    await Gallery.findByIdAndUpdate(galleryExist, updateGalleryWithNewInfo);
                    if (req.file) {
                        deleteImgCloudinary(galleryExist.image);
                    };

                    //! ----------------test  runtime ----------------
                    // buscamos la gallery actualizada
                    const updateGallery = await Gallery.findById(id);
                    // cogemos las keys del body
                    const updateKeys = Object.keys(req.body);
                    // creamos una variable para guardar los test
                    const testUpdate = [];
                    // recorremos las keys y comparamos
                    updateKeys.forEach((item) => {
                        // Ponemos item entre [] para que coja cada nombre de la clave concreta en lugar de la palabra 'item'
                        // Ponemos == ya que pueden aparecer numeros que en uno actue como numero y en otro como string (updateGallery lo pasa a texto plano)
                        if (updateGallery[item] == req.body[item]) {
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
                        updateGallery.image == req.file.path
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
                deleteImgCloudinary(catchImg);
                return res.status(404).json('this user did not create this gallery.')
            }       
        } else {
            return res.status(400).json('This user is not registered or this gallery ID does not exist.')
        }

    } catch (error) {
        deleteImgCloudinary(catchImg);
        return next(setError(error.code || 500, error.message || 'Update gallery failed'));
    };
};



//! -------------------------------------------------------------------------------
//? -------------------------- DELETE GALLERY -------------------------------------
//! -------------------------------------------------------------------------------

const deleteGallery = async (req, res, next) => {
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Gallery.syncIndexes();

        const { _id } = req.user;
        const { id } = req.params;

        // Comprobamos que el user y la galeria  existen y es el que ha puesto la galeria, si no lo ha puesto, no puede borrarlo.
        const user = await User.findById(_id);
        const galleryExist = await Gallery.findById(id);
        const galleryIsInCharacter = await Character.findById(galleryExist.character);

        if (user != null && galleryExist != null) {
            if (user.characterImagesUpload.includes(id)) {
                if (galleryIsInCharacter != null) {
                    await user.updateOne({ $pull: { characterImagesUpload: galleryExist._id } });
                    await galleryIsInCharacter.updateOne({ $pull: { characterGallery: galleryExist._id } });
                } else {
                    return res.status(404).json('This gallery is not included in this character.')
                }
                const deleteGallery = await Gallery.findByIdAndDelete(galleryExist)
                try {
                    if (deleteGallery) {
                        deleteImgCloudinary(galleryExist.image);
                        return res.status(200).json('Gallery deleted from de DB ✅')
                    } else {
                        return res.status(404).json('Gallery was not deleted ❌');
                    };
                } catch (error) {
                    return res.status(404).json(error.message);
                }
            } else {
                return res.status(404).json('this user did not create this gallery.')
            };     
        } else {
            return res.status(400).json('This user is not registered or this gallery ID does not exist.')
        }
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Delete gallery failed'));
    };
};


//! -------------------------------------------------------------------------------------
//? -------------------------- ADMIN DELETE GALLERY -------------------------------------
//! -------------------------------------------------------------------------------------

const adminDeleteGallery = async (req, res, next) => {
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Gallery.syncIndexes();

        // const { _id } = req.user;        no hace falta el req.user porque ya lo comprueba el middleware
        const { id } = req.params;

        // Comprobamos que el user y el comentario existen y es el que ha puesto el comentario
        // const user = await User.findById(_id);
        const galleryExist = await Gallery.findById(id);
        const galleryIsInUser = await User.findById(galleryExist.user);
        const galleryIsInCharacter = await Character.findById(galleryExist.character);

        if (galleryIsInCharacter != null) {
            await galleryIsInUser.updateOne({ $pull: { characterImagesUpload: galleryExist._id } });
            await galleryIsInCharacter.updateOne({ $pull: { characterGallery: galleryExist._id } });
        } else {
            return res.status(404).json('This gallery is not included in this character.')
        }
        const deleteGallery = await Gallery.findByIdAndDelete(galleryExist)
        try {
            if (deleteGallery) {
                deleteImgCloudinary(galleryExist.image);
                return res.status(200).json('Gallery deleted from de DB ✅')
            } else {
                return res.status(404).json('Gallery was not deleted ❌');
            };
        } catch (error) {
            return res.status(404).json(error.message);
        }
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Admin delete gallery failed'));
    };
};


//! ----------------------------------------------------------------------------------
//? -------------------------- GET GALLERY BY ID -------------------------------------
//! ----------------------------------------------------------------------------------

const getGalleryById = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        const galleryById = await Gallery.findById(id).populate('user character');
        if(galleryById) {
            return res.status(200).json(galleryById);
        } else {
            return res.status(404).json('We could not find a gallery with this ID.')
        }
    } catch (error) {
        return next(error);
    }
}

//! ---------------------------------------------------------------------------------
//! -----------------------------user gallery, character ----------------------------------------------------
//! ---------------------------------------------------------------------------------
//! ---------------------------------------------------------------------------------
//? -------------------------- GET ALL GALLERY -------------------------------------
//! ---------------------------------------------------------------------------------

const getAllGalleries = async (req, res, next) => {
    try {
        const allGalleries = await Gallery.find().populate('user character');
        if (allGalleries) {
            return res.status(200).json(allGalleries);
        } else {
            return res.status(404).json('❌ We could not get all Galleries. ❌')
        }
    } catch (error) {
        return next(error);
    }
};




module.exports = {
    createNewGallery,
    updateGallery,
    deleteGallery,
    adminDeleteGallery,
    getGalleryById,
    getAllGalleries
};