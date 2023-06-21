const Publication = require('../models/publication');

const fs = require('fs');
const path = require('path');

const followService = require('../services/followStudentIds');

//guardar publicaciones
const save = (req, res) => {
    //recorger datos del body
    const params = req.body;
    //si no me llegan respuesta negativa
    if (!params.text) {
        return res.status(400).send("Debe ingresar un texto");
    }
    //crear y rellenar datos del modelo
    let newPublication = new Publication(params);
    newPublication.student = req.student.id;
    //guardar publicacion en la base de datos
    newPublication.save((err, publicationStored) => {
            if (err || !publicationStored) {
                return res.status(500).send('no se pudo guardar la publicacion');
            }
            return res.status(200).send({
                message: 'Publicacion guardada',
                publicationStored
            });

    });
};
//sacar una publicacion
const detailPublication = (req, res) => {
    //sacar id de la url
    const publicationId = req.params.id;

    //find con la condicion id
    Publication.findById(publicationId, (err, publicationFound) => {
            if (err || !publicationFound) {
                return res.status(500).send('no se pudo encontrar la publicacion');
            }
            return res.status(200).send({
                message: 'Detalle de la publicacion solicitada',
                publicationFound
            });
        });
};
//eliminar publicacion
const deletePublication = (req, res) => {
    //sacar id de la url
    const publicationId = req.params.id;
    //find con la condicion id
    Publication.find({"student": req.student.id, "_id": publicationId}).remove((err, publicationRemoved) => {
        if (err ||!publicationRemoved) {
            return res.status(500).send('no se pudo encontrar la publicacion');
        }
        return res.status(200).send({
            message: 'Publicacion eliminada',
            publicationRemoved
        });
    });
};

//listar publicaciones de un usuario especifico

const publicationStudent = (req, res) => {
    //sacar id del usuario 
    const studentId = req.params.id;
    //controlar las paginas
    let page = 1;
    const itemsPerPage = 5;

    if (req.params.page) {
        page = req.params.page;
    }

    //find, pupulate y paginacion
    Publication.find({"student": studentId})
        .sort("-created_at")
        .populate('student', '-password -__v -email')
        .paginate(page, itemsPerPage, (err, publications, total) => {
            if (err ||!publications) {
                return res.status(500).send('no se pudo encontrar publicaciones');
            }
            return res.status(200).send({
                message: 'Publicaciones del estudiante',
                publications,
                page,
                total,
                totalPages: Math.ceil(total / itemsPerPage)
            });
        })
};
//subir ficheros
const upload = (req, res) => {
    const publicationId = req.params.id;
    //recoger el fichero de imagen y comprobar si existe
    if (!req.file) {
        return res.status(404).send( "no ha agregado ninguna imagen")
    }
    //conseguir el nombre del archivo
    const image = req.file.originalname;

    //sacar la extension del archivo
    const imageSplit = image.split(".");
    const extension = imageSplit[1];
    //comprobar si es jpg
    if (extension != "jpg" && extension!= "jpeg"  && extension != "png" && extension != "gif") {
        //si no es jpg, borrar la imagen
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        return res.status(400).send("La extension del archivo no es valido");
    }

    //si es jpg, agregar la imagen a la base de datos
    //finOneAndUpdate({1},{2}) -> 1: condicion, 2: update
    Publication.findByIdAndUpdate({'student': req.student.id, '_id': publicationId}, {file: req.file.filename}, {new: true}, (error, publicationUpdated) => {
            if (error || !publicationUpdated) {
                return res.status(500).send( "error al subir la imagen en la publicacion")
            }
            return res.status(200).json({
                status: "success",
                menssage:"Actualizando...",
                student: publicationUpdated,
                file: req.file
            });
        });
}
//devolver archivos multimedia
const media = (req, res) => {

    //sacar el parametro de la url
    const file = req.params.file;

    //mostrar el path de la imagen
    const filePath = "./uploads/publications/" + file;
    //comprobar si existe la imagen
    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(404).send( "no existe la imagen")
        }
        //devolver la imagen
        return res.sendFile(path.resolve(filePath));

    });
};
//listar publicaciones
const feed = async (req, res) => {
    //sacar la pagina actual
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    //elementos por pagina
    let itemsPerPage = 10;
    //sacar un array de id, elementos que estan dentro de la coleccion follow, como usuario identificado
    try {
        const myFollows = await followService.followStudentIds(req.student.id);
        // const publications = await Publication.find({student: myFollows.following}).populate('student').sort('-created_at')
        const allPublications =  Publication.find()
                                                    .populate('student', '-password -__v -email')
                                                    .sort('-created_at')
                                                    .paginate(page, itemsPerPage, (err, publications, total) => {

                                                            if (err ||!publications) {
                                                                return res.status(500).send('no se pudo encontrar publicaciones');
                                                            }
                                                            return res.status(200).send({
                                                                message: 'feed',
                                                                following: myFollows.following,
                                                                publications,
                                                                page,
                                                                total,
                                                                totalPages: Math.ceil(total / itemsPerPage)
                                                            });
                                                    });
    } catch (error) {
        return res.status(500).send(error);
    }

    //find a publicaciones in, ordenar, popular y paginar

};


module.exports = {
    save,
    detailPublication,
    deletePublication,
    publicationStudent,
    upload,
    media,
    feed
};
