const mongoose = require('mongoose');
const {Schema} = mongoose

const GallerySchema = new Schema(
    {
        image: {type:String, required:true},
        imageMovieTitle: {type:String, required:true},
        user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},             //! Si no funciona, he quitado el array de objetos
        character: {type:mongoose.Schema.Types.ObjectId, ref:'Character'}   //! Si no funciona, he quitado el array de objetos
    },
    {
        timestamps: true
    }
);

const Gallery = mongoose.model('Gallery', GallerySchema);

module.exports = Gallery;