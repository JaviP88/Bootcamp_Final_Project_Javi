const User = require("../api/models/user.model");
const { verifyToken } = require('../utils/token');
const dotenv = require('dotenv');
dotenv.config();

//! Vamos a hacer 2 funciones, una cuando estás autenticado y otra cuando estás autenticado y eres administrador

//? vid 7 - min 3

const isAuth = async (req, res, next) => {
    // le quitamos el bearer token (un tipo de token): le quitamos el prefijo de bearer al token para que podamos pasarlo a verificarlo
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return next(new Error('Unauthorized'))
    }
    try {
        // ---> decodificamos el token y sacomos el id y email que es con lo que hemos creado el token
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next()
    } catch (error) {
        return next(error)
    }
}

const isAuthAdmin = async (req, res, next) => {
    // le quitamos el bearer token (un tipo de token): le quitamos el prefijo de bearer al token para que podamos pasarlo a verificarlo
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return next(new Error('Unauthorized'))
    }
    try {
        // ---> decodificamos el token y sacomos el id y email que es con lo que hemos creado el token
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        // En el siguiente paso mira si eres administrador (no sólo el token), y si no lo eres, lanza un error
        if (req.user.rol !== 'admin') {
            return next(new Error('Unauthorized, you are not an admin'));
        }
        next()
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    isAuth,
    isAuthAdmin
};