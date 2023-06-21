//importar dependencias
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

//conexion a bbdd
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("conexion exitosa");
  })
  .catch((error) => {
    console.log(error);
  });

//crear servidor node
const app = express();

//configurar cors
app.use(cors())

//convertir datos del body a js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cargar conf las rutas
const studentRoutes = require('./routes/student');
const followRoutes = require('./routes/follow');
const publicationRoutes = require('./routes/publication');

app.use("/api/student", studentRoutes);
app.use("/api/follow", followRoutes);
app.use('/api/publication', publicationRoutes);

//poner servidor a escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Server iniciado en el puerto: ${process.env.PORT}`);
});
