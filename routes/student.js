const express = require ('express');
const api = express.Router();
const multer = require('multer');
const studentController = require ('../controllers/student');
const check = require('../middlewares/auth');

//configuracion de multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profilePictures')
    },
    filename: function (req, file, cb) {
        cb(null, "profilePicture"+Date.now()+"-"+ file.originalname)
    }
});

const uploadImage = multer({storage});

api.get("/pruebaStudent", check.auth, studentController.pruebaStudent);
api.post("/register", studentController.register);
api.post("/login", studentController.login);
api.get("/profile/:id", check.auth, studentController.profile);
//page es un parametro opcional
api.get("/list/:page?", check.auth, studentController.list);
api.put("/update", check.auth, studentController.update);
//[check.auth, uploadImage.single("upload0")]  ---> los corchetes para usar varios middlewares
api.post("/uploadImage",[check.auth, uploadImage.single("upload0")], studentController.uploadImage);
api.get("/profilePicture/:file", studentController.profilePicture);
api.get('/counter/:id', check.auth, studentController.counter);

module.exports = api;