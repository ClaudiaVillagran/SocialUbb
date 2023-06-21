const express = require('express');
const api = express.Router();
const publicationController = require('../controllers/publication');
const check = require('../middlewares/auth');
const multer = require('multer');

//configuracion de multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/publications/')
    },
    filename: function (req, file, cb) {
        cb(null, "pub-"+Date.now()+"-"+ file.originalname)
    }
});

const uploads = multer({storage});

api.post('/save', check.auth, publicationController.save);
api.get('/detailPublication/:id', check.auth, publicationController.detailPublication);
api.delete('/deletePublication/:id', check.auth, publicationController.deletePublication);
api.get('/publicationStudent/:id/:page?', check.auth, publicationController.publicationStudent);
api.post('/upload/:id', [check.auth,uploads.single('upload0')], publicationController.upload);
api.get('/media/:file', publicationController.media);
api.get('/feed/:page?', check.auth, publicationController.feed);

module.exports = api;