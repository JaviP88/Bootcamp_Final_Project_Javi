const mongoose = require('mongoose');
const {Schema} = mongoose

const CommentsSchema = new Schema(
    {
        userComment: {type:String, required:true},
        user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},         //! Si no funciona, he quitado el array de objetos
        character: {type:mongoose.Schema.Types.ObjectId, ref:'Character'},      //? No es un array de objetos... es solo un objeto que va a ir al personaje
        movie: {type:mongoose.Schema.Types.ObjectId, ref:'Movie'}               //? No es un array de objetos... es solo un objeto que va a ir a la película
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', CommentsSchema);

module.exports = Comment;