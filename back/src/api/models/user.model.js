const mongoose = require('mongoose')
const validator = require('validator')
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
    {
        name:{type:String, required:true, unique:true},
        email:{type:String, required:true, validate:[validator.isEmail, "Email not valid"], unique:true},
        password:{type:String, required:true, validate:[validator.isStrongPassword], minlenght:[8, "min 8 characters"]},
        gender:{type: String, enum:["hombre", "mujer"], required:true},
        rol:{type: String, enum:["admin", "user"], required:true},
        image:{type:String},
        confirmationCode:{type:Number, required:true},
        checkConfrmationCode:{type:Boolean, default:false},
        favouriteCharacters:[{type:mongoose.Schema.Types.ObjectId, ref:"Character"}]
    },
    {
        timestamps:true
    }
);

//! Antes de guardar el modelo tenemos que hacer un presave para convertir la contraseña en encrictada

UserSchema.pre('save', async function (next) {
    try {
        // vamos a encryptar la contraseña con 10 veces la encriptación
        this.password = await bcrypt.hash(this.password, 10);
        // metemos el next vacío para que continúe
        next()
    } catch (error) {
        next('Error hasing password', error)
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;