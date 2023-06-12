//
const jwt = require('jwt-simple');
const moment = require('moment');

//clave secreta
const secret = "CLAVE_SECRETA_PROYECTO_13242"

//crear funcion para generar token
const createToken = (student) => {
    const payload = {
        id: student._id,
        name: student.name,
        email: student.email,
        image: student.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };
    //devolver jwt token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}