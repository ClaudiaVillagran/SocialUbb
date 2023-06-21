//importar modelo
const Follow = require('../models/follow');
const Student = require('../models/student');

const mongoosePaginate = require('mongoose-pagination');

//importar servicios
const followService = require('../services/followStudentIds');

//accion de guardar follow
const save = (req, res) => {
    //conseguir los datos del body
    const params = req.body;

    //sacar el id del estudiante identificado
    const identity = req.student;

    //crear objeto de follow
    let userToFollow = new Follow({
        student: identity.id,
        followed: params.followed
    });
    //gaurdar objetos de follow en la base de datos
    userToFollow.save((error, followStored) => {
        console.log(followStored);
        if (error || !followStored) {
            return res.status(500).send({
                message: 'Error al guardar el follow'
            });
        }
        return res.status(200).send({
            message: 'follow guardado',
            student: identity,
            follow: followStored
        });
    });

}
//accion de dejar follow
const unFollow = (req, res) => {
    //conseguir id del usuario identificado
    const identityId = req.student.id;
    //conseguir id del usuario que quiero dejar de seguir
    const followedId = req.params.id;
    //eliminar follow
    Follow.findOneAndDelete({
        student: identityId,
        followed: followedId
    }, (error, followDeleted) => {
        if (error ||!followDeleted) {
            return res.status(500).send({
                message: 'Error al eliminar el follow'
            });
        }
        return res.status(200).send({
            message: 'follow eliminado',
            student: identityId,
            unFollow: followDeleted
        });
    });
};
//accion listado de estudiantes que sigo
const following = (req, res) => {
    //sacar el id del estudiante identificado
    let identityId = req.student.id;
    //comprobar si me llega el id en la url
    if (req.params.id) {
        identityId = req.params.id;
    }
    //comprobar si me llega la pagina en la url, por defecto es la pag 1
    let page = 1

    if (req.params.page) {
        page = req.params.page;
    }
    //estduiantes por pagina que quiero mostrar
    const itemsPerPage = 5;

    //find a follow, populate de los estudiantes y paginar con mongoose
            //en el segundo parametro del popule, si le pongo el menos, es lo que no quiero mostrar,
                // sin el menos, el lo que quiero mostrar
    Follow.find({ student: identityId})
        .populate("student followed", "-password -__v -email")
        .paginate(page, itemsPerPage, async (error, follows, total) => {

            //seguidores en comun
            //sacar un array de estudiantes que sigo y me siguen
            let followStudentIds = await followService.followStudentIds(req.student.id);

            if (error) {
                return res.status(500).send({
                    message: 'Error al listar los follow'
                });
            }
            return res.status(200).send({
                message: 'Listando estudiantes que sigo',
                follows,
                total,
                totalPages: Math.ceil(total / itemsPerPage),
                student_following: followStudentIds.following,
                student_follow_me: followStudentIds.followers
            });

    });
    
};

//accion listado de estudiantes que me siguen

const followedBy = (req, res) => {
    //sacar el id del estudiante identificado
    let identityId = req.student.id;
    //comprobar si me llega el id en la url
    if (req.params.id) {
        identityId = req.params.id;
    }
    //comprobar si me llega la pagina en la url, por defecto es la pag 1
    let page = 1

    if (req.params.page) {
        page = req.params.page;
    }
    //estduiantes por pagina que quiero mostrar
    const itemsPerPage = 5;


    Follow.find({ followed: identityId})
        .populate("student", "-password -__v -email")
        .paginate(page, itemsPerPage, async (error, follows, total) => {

            //seguidores en comun
            //sacar un array de estudiantes que sigo y me siguen
            let followStudentIds = await followService.followStudentIds(req.student.id);

            if (error) {
                return res.status(500).send({
                    message: 'Error al listar los follow'
                });
            }
            return res.status(200).send({
                message: 'listo estudiantes que me siguen',
                follows,
                total,
                totalPages: Math.ceil(total / itemsPerPage),
                student_following: followStudentIds.following,
                student_follow_me: followStudentIds.followers
            });

    });
};
//exportar acciones
module.exports = {
    save,
    unFollow,
    following,
    followedBy
};
