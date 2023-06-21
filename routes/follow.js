const express = require('express');
const api = express.Router();
const followController = require('../controllers/follow');
const check = require('../middlewares/auth');

//definir rutas
api.post('/save', check.auth, followController.save);
api.delete('/unFollow/:id', check.auth, followController.unFollow);
api.get('/following/:id?/:page?', check.auth, followController.following);
api.get('/followedBy/:id?/:page?', check.auth, followController.followedBy);

//exportar rutas
module.exports = api;