const express = require ('express');
const api = express.Router();
const studentController = require ('../controllers/student');
const auth = require('../middlewares/auth');

api.get("/pruebaStudent", auth.auth, studentController.pruebaStudent);
api.post("/register", studentController.register);
api.post("/login", studentController.login);

module.exports = api;