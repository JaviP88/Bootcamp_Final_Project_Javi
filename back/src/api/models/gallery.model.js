const mongoose = require('mongoose');
const {Schema} = mongoose

const GallerySchema = new Schema(
    {
        image: {type:String, required:true},
        imageMovieTitle: {type:String, required:true},
        user:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
        character: [{type:mongoose.Schema.Types.ObjectId, ref:'Character'}]
    },
    {
        timestamps: true
    }
);

const Gallery = mongoose.model('Gallery', GallerySchema);

module.exports = Gallery;