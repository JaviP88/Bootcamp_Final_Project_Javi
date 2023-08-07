const Comment = require('../models/comment.model');
const Character = require('../models/character.model');
const Movie = require('../models/movie.model');
const dotenv = require('dotenv');
const setError = require('../../helpers/handle-error');
const User = require('../models/user.model');
dotenv.config()



//! -----------------------------------------------------------------------------------
//? -------------------------- CREATE NEW COMMENT -------------------------------------
//! -----------------------------------------------------------------------------------

const createNewComment = async (req, res, next) => {
    try {
        // Sacamos el ID del usuario que va a subir el comentario.
        const { _id } = req.user;
        // Y el ID del personaje o la pelicula a la que vamos a añadir el comentario
        const idToAddComment = req.params.elementId;
        // Actualizamos los indexes
        await Character.syncIndexes();
        await Movie.syncIndexes();

        try {
            const user = await User.findById(_id);
            const character = await Character.findById(idToAddComment);
            const movie = await Movie.findById(idToAddComment);
            
            if (user != null) {
                // Creamos una nueva instancia de comentario
                const newComment = new Comment({ ...req.body });
                const createComment = await newComment.save();
                
                if (character != null) {
                    await user.updateOne({ $push: { userComments: createComment._id } });
                    await character.updateOne({ $push: { characterComments: createComment._id } });
                    await createComment.updateOne({ $push: { user: user._id } });
                    await createComment.updateOne({ $push: { character: character._id } });
                } else if (movie != null) {
                    await user.updateOne({ $push: { userComments: createComment._id } });
                    await movie.updateOne({ $push: { movieComments: createComment._id } });
                    await createComment.updateOne({ $push: { user: user._id } });
                    await createComment.updateOne({ $push: { movie: movie._id } });
                } else {
                    return res.status(404).json('We could not found Character ID or movie ID in DB')
                };
                return res.status(201).json({
                    comment: createComment
                });
            } else {
                return res.status(404).json('To add a comment must be a registered user.');
            };    
        } catch (error) {
            return res.status(500).json(error.message)
        };
        
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Create comment failed.'));
    };
};

//!
//!
//!
//!
//!    OJO!!! para que puedan manipular comentarios, sólo el usuario que lo crea lo puede borrar
//!
//!
//!
//! -------------------------------------------------------------------------------
//? -------------------------- UPDATE COMMENT -------------------------------------
//! -------------------------------------------------------------------------------

const updateComment = async (req, res, next) => {
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Comment.syncIndexes();

        const { _id } = req.user;
        const { id } = req.params;

        // Comprobamos que el user y el comentario existen y es el que ha puesto el comentario
        const user = await User.findById(_id);
        const commentExist = await Comment.findById(id);

        if (user != null && commentExist != null) {
            if (user.userComments.includes(id)) {
                const updateCommentWithNewInfo = new Comment(req.body);

                // No quiero que se pueda actualizar el ID
                updateCommentWithNewInfo._id = commentExist._id;
                updateCommentWithNewInfo.user = commentExist.user;
                updateCommentWithNewInfo.character = commentExist.character;
                updateCommentWithNewInfo.movie = commentExist.movie;


                // Actualizamos la DB con el ID y la instancia del modelo de comment
                try {
                    await Comment.findByIdAndUpdate(commentExist, updateCommentWithNewInfo);

                    //! ----------------test  runtime ----------------
                    // buscamos el comentario actualizado
                    const updateComment = await Comment.findById(id);
                    // cogemos las keys del body
                    const updateKeys = Object.keys(req.body);
                    
                    // creamos una variable para guardar los test
                    const testUpdate = [];
                    // recorremos las keys y comparamos
                    updateKeys.forEach((item) => {
                        // Ponemos item entre [] para que coja cada nombre de la clave concreta en lugar de la palabra 'item'
                        // Ponemos == ya que pueden aparecer numeros que en uno actue como numero y en otro como string (updateComment lo pasa a texto plano)
                        if (updateComment[item] == req.body[item]) {
                            testUpdate.push({
                                [item]: true
                            });
                        } else {
                            testUpdate.push({
                                [item]: false
                            });
                        };
                    });
                    return res.status(200).json({
                        testUpdate
                    });
                } catch (error) {
                    return res.status(404).json(error.message);
                };
            } else {
                return res.status(404).json('this user did not create this comment.')
            }       
        } else {
            return res.status(400).json('This user is not registered or this comment ID does not exist.')
        }

    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Update comment failed'));
    };
};


//! -------------------------------------------------------------------------------
//? -------------------------- DELETE COMMENT -------------------------------------
//! -------------------------------------------------------------------------------

const deleteComment = async (req, res, next) => {
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Comment.syncIndexes();

        const { _id } = req.user;
        const { id } = req.params;

        // Comprobamos que el user y el comentario existen y es el que ha puesto el comentario
        const user = await User.findById(_id);
        const commentExist = await Comment.findById(id);
        const commentIsInCharacter = await Character.findById(commentExist.character);
        const commentIsInMovie = await Movie.findById(commentExist.movie)

        if (user != null && commentExist != null) {
            if (user.userComments.includes(id)) {
                if (commentIsInCharacter != null) {
                    await user.updateOne({ $pull: { userComments: commentExist._id } });
                    await commentIsInCharacter.updateOne({ $pull: { characterComments: commentExist._id } });
                } else if (commentIsInMovie != null) {
                    await user.updateOne({ $pull: { userComments: commentExist._id } });
                    await commentIsInMovie.updateOne({ $pull: { movieComments: commentExist._id } });
                } else {
                    return res.status(404).json('This comment is not included in this character/movie.')
                }
                try {
                    const deleteComment = await Comment.findByIdAndDelete(commentExist)
                    if (deleteComment) {
                        return res.status(200).json('Comment deleted from de DB ✅')
                    } else {
                        return res.status(404).json('Comment was not deleted ❌');
                    };
                } catch (error) {
                    return res.status(404).json(error.message);
                }
            } else {
                return res.status(404).json('this user did not create this comment.')
            };     
        } else {
            return res.status(400).json('This user is not registered or this comment ID does not exist.')
        }
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Delete comment failed'));
    };
};


//! -------------------------------------------------------------------------------------
//? -------------------------- ADMIN DELETE COMMENT -------------------------------------
//! -------------------------------------------------------------------------------------

const adminDeleteComment = async (req, res, next) => {
    try {
        // actualizamos los indexes de los elementos unicos por si han modificado
        await Comment.syncIndexes();

        // const { _id } = req.user;        no hace falta el req.user porque ya lo comprueba el middleware
        const { id } = req.params;

        // Comprobamos que el user y el comentario existen y es el que ha puesto el comentario
        // const user = await User.findById(_id);
        const commentExist = await Comment.findById(id);
        const commentIsInUser = await User.findById(commentExist.user);
        const commentIsInCharacter = await Character.findById(commentExist.character);
        const commentIsInMovie = await Movie.findById(commentExist.movie)

        if (commentIsInCharacter != null) {
            await commentIsInUser.updateOne({ $pull: { userComments: commentExist._id } });
            await commentIsInCharacter.updateOne({ $pull: { characterComments: commentExist._id } });
        } else if (commentIsInMovie != null) {
            await commentIsInUser.updateOne({ $pull: { userComments: commentExist._id } });
            await commentIsInMovie.updateOne({ $pull: { movieComments: commentExist._id } });
        } else {
            return res.status(404).json('This comment is not included in this character/movie.')
        }
        try {
            const deleteComment = await Comment.findByIdAndDelete(commentExist)
            if (deleteComment) {
                return res.status(200).json('Comment deleted from de DB ✅')
            } else {
                return res.status(404).json('Comment was not deleted ❌');
            };
        } catch (error) {
            return res.status(404).json(error.message);
        }
    } catch (error) {
        return next(setError(error.code || 500, error.message || 'Admin delete comment failed'));
    };
};


//! ----------------------------------------------------------------------------------
//? -------------------------- GET COMMENT BY ID -------------------------------------
//! ----------------------------------------------------------------------------------

const getCommentById = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        const commentById = await Comment.findById(id).populate('user character movie');
        if(commentById) {
            return res.status(200).json(commentById);
        } else {
            return res.status(404).json('We could not find a comment with this ID.')
        }
    } catch (error) {
        return next(error);
    }
}

//! ---------------------------------------------------------------------------------
//! -----------------------------user coments, character y movieComments----------------------------------------------------
//! ---------------------------------------------------------------------------------
//! ---------------------------------------------------------------------------------
//? -------------------------- GET ALL COMMENTS -------------------------------------
//! ---------------------------------------------------------------------------------

const getAllComments = async (req, res, next) => {
    try {
        const allComments = await Comment.find().populate('user character movie');
        if (allComments) {
            return res.status(200).json(allComments);
        } else {
            return res.status(404).json('❌ We could not get all comments. ❌')
        }
    } catch (error) {
        return next(error);
    }
};




module.exports = {
    createNewComment,
    updateComment,
    deleteComment,
    adminDeleteComment,
    getCommentById,
    getAllComments
};