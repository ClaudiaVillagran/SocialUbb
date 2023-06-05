const mongoose = require ('mongoose');

const connection = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/SocialUbb");
        console.log("conectado de forma correcta a la bd socialubb");
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    connection
}