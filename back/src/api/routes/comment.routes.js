const express = require('express');
const {
    createNewComment,
    updateComment,
    deleteComment,
    adminDeleteComment,
    getCommentById,
    getAllComments
} = require('../controllers/comments.controller');
const { isAuth, isAuthAdmin } = require('../../middlewares/auth.middleware');
const CommentRoutes = express.Router();

CommentRoutes.post('/newComment/:elementId', [isAuth], createNewComment);
CommentRoutes.patch('/updateComment/:id', [isAuth], updateComment);
CommentRoutes.delete('/deleteComment/:id', [isAuth], deleteComment);
CommentRoutes.delete('/adminDeleteComment/:id', [isAuthAdmin], adminDeleteComment);
CommentRoutes.get('/:id', getCommentById);
CommentRoutes.get('/allComment/allComment', getAllComments);


module.exports = CommentRoutes;