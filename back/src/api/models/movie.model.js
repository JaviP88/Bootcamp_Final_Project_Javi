const mongoose = require('mongoose');
const {Schema} = mongoose

const MoviesSchema = new Schema(
    {
        name: {type:String, required:true, unique:true},
        image: {type:String, required:true},
        year: {type:Number, required:true},
        description: {type:String, required:true, unique:true},
        user:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
        movieComments: [{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
        movieCharacters: [{type:mongoose.Schema.Types.ObjectId, ref:'Character'}]
    },
    {
        timestamps: true
    }
);

const Movie = mongoose.model('Movie', MoviesSchema);

module.exports = Movie;