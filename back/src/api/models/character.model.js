const mongoose = require('mongoose');
const {Schema} = mongoose

const CharactersSchema = new Schema(
    {
        name: {type:String, required:true, unique:true},
        image: {type:String, required:true},
        //movie: {type:String, required:true},
        description: {type:String, required:true, unique:true},
        user:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
        characterComments: [{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
        movie: [{type:mongoose.Schema.Types.ObjectId, ref:'Movie'}],
        characterGallery: [{type:mongoose.Schema.Types.ObjectId, ref:'Gallery'}]
    },
    {
        timestamps: true
    }
);

const Character = mongoose.model('Character', CharactersSchema);

module.exports = Character;