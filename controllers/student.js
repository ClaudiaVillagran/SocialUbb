const bcrypt = require("bcrypt")
const Student = require('../models/student')
const jwt = require('../services/jwt')
const fs = require('fs');
const path = require('path');
const followService = require('../services/followStudentIds');
const Publication = require('../models/publication');
const Follow = require('../models/follow');

const pruebaStudent = (req, res) => {
    return res.status(200).send({
        menssage:"prueba ruta",
        Student: req.student
    })
}

const register = (req, res) => {
    //registrar datos de la peticion
    const params = req.body
    
    //comprobar que llegan
    if (!params.name || !params.email || !params.password) {
        return res.status(200).json({
            status: "error",
            message: "faltan datos"
        })
    }

    
    //control de usuarios duplicados
        //con el $or decimos que se debe cumplir una condicion u otra
    Student.find({
        $or: [
            {name: params.name.toLowerCase()},
            {email: params.email.toLowerCase()}
        ]
    }).exec(async(error, students) => {
        if (error) {
            return res.status(500).send( "error al crear usuario")
        }
        if (students && students.length >=1) {
            return res.status(200).send( "El usuario ya existe")
        }

        //encriptar contraseña
            //la encripta 10 veces
        let pwd = await bcrypt.hash(params.password, 10)
        params.password=pwd

        //crear objeto
        const newStudent = new Student(params);

        //guardar en bd
        newStudent.save((error, studentStored) => {
            if (error || !studentStored) {
                return res.status(500).send( "error al guardar usuario")
            }
            //devolver resultado
            return res.status(200).json({
                status: "success",
                menssage:"registro de usuarios",
                student: newStudent
            });
        })
        
    });
        
}

const login = (req, res) => {
    //recibir body
    const params = req.body;

    if (!params.email || !params.password) {
        return res.status(500).send("faltan datos")
    }
    //buscar si existe en la bd
    Student.findOne({email: params.email})
        //muestra todos los datos menos la password
        // .select({"password":0})
        .exec((error, student)=> {
            if (error || !student) {
                return res.status(404).send("error al encontrar usuario")
            }
            //comprobar contraseña
            const pwd = bcrypt.compareSync(params.password, student.password)

            if (!pwd) {
                return res.status(404).send("Contraseña incorrecta!!")
            }
            //conseguir token
            const token = jwt.createToken(student)
            //eliminar password del objeto


            //devolver datos usuario
            return res.status(200).json({
                status: "success",
                menssage:"logeando...",
                student: {
                    id: student.id,
                    name: student.name,
                    image: student.image
                },
                token
            });
        })
}
const profile = (req, res) => {
    //recibir el parametro de id por url
    const id = req.params.id;

    //sacar los datos del estudiante
    Student.findById(id)
        .select({"password":0})
        .exec(async(error, studentProfile) =>{
        if (error ||!studentProfile) {
            return res.status(404).send("error al encontrar usuario")
        }
        //info de seguimiento
                    //primero parametro sera el usuario identificado y el segundo el usuario de la url(perfil qu estamos viendo)
        const followInfo = await followService.followThisStudent(req.student.id, id);
        //devolver datos estudiante
        return res.status(200).json({
            status: "success",
            menssage:"profilando...",
            student: studentProfile,
            followig: followInfo.following,
            follower: followInfo.follower
        })

    })
}
const list = (req, res) => {
    //controlar en que pagina estamos
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    page = parseInt(page);

    //Consulta con mongoose paginate
    let itemsPerPage = 5;

    Student.find().select('-email -password -__v').sort('_id').paginate(page, itemsPerPage, async(error, students, total) => {
        if (error ||!students) {
            return res.status(404).send("error al encontrar usuario")
        }
        let followStudentIds = await followService.followStudentIds(req.student.id);
        
            //devolver resultado
            return res.status(200).json({
                       status: "success",
                         menssage:"listando...",
                         students: students,
                         itemsPerPage,
                         totalPages: Math.ceil(students.total / itemsPerPage),
                         student_following: followStudentIds.following,
                        student_follow_me: followStudentIds.followers
    
            })

    })


    // const opciones = {
    //     page: page,
    //     limit: itemsPerPage,
    //     sort: { _id: -1 }
    // };

    // Student.paginate({}, opciones, async(error, students, total) => {
    //     if (error ||!students) {
    //         return res.status(404).send(error,"error al encontrar usuario")
    //     }

    //     //sacar un array de estudiantes que sigo y me siguen
    //     let followStudentIds = await followService.followStudentIds(req.student.id);

    //     //devolver resultado
    //     return res.status(200).json({
    //                 status: "success",
    //                 menssage:"listando...",
    //                 students: students,
    //                 itemsPerPage,
    //                 totalPages: Math.ceil(students.total / itemsPerPage),
    //                 student_following: followStudentIds.following,
    //                 student_follow_me: followStudentIds.followers

    //             })
    // });
}

const update = (req, res) => {
    //recorger la info a actualizar
    const studentIdentity = req.student;
    const studentToUpdate = req.body;
    //eliminar campos sobrantes
    delete studentToUpdate.iat;
    delete studentToUpdate.exp;

    //comprobar si existe el usuario
    Student.find({
        $or: [
            {name: studentIdentity.name.toLowerCase()},
            {email: studentIdentity.email.toLowerCase()}
        ]
    }).exec(async(error, students) => {
        if (error) {
            return res.status(500).send( "error al crear usuario")
        }
        
        let studentIsset = false;

        students.forEach(student => {
            if (student && student.id != studentIdentity.id) {
                studentIsset = true;
            }
        })
        if (studentIsset) {
            return res.status(200).send( "El usuario ya existe")
        }

        //si actualiza la password, cifrar
        if (studentToUpdate.password) {
            let pwd = await bcrypt.hash(params.password, 10)
            studentToUpdate.password=pwd
        }else{
            delete studentToUpdate.password
        }
        
        try {
             //buscar y actualizar
            let studentUpdated = await Student.findByIdAndUpdate(studentIdentity.id, studentToUpdate);

            if (!studentUpdated) {
                return res.status(500).send( "error al actualizar usuario")
            }
            return res.status(200).json({
                status: "success",
                menssage:"Actualizando...",
                student: studentUpdated
            });

        } catch (error) {
            return res.status(500).json({
                status: "success",
                menssage:"Error al actualizar."
            });
        }
    });
}

const uploadImage = (req, res) => {

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
    Student.findByIdAndUpdate({ _id: req.student.id}, {image: req.file.filename}, {new: true}, (error, studentUpdated) => {
            if (error || !studentUpdated) {
                return res.status(500).send( "error al subir la foto de perfil")
            }
            return res.status(200).json({
                status: "success",
                menssage:"Actualizando...",
                student: studentUpdated,
                file: req.file,
                image
            });
        });
}

const profilePicture = (req, res) => {

    //sacar el parametro de la url
    const file = req.params.file;

    //mostrar el path de la imagen
    const filePath = "./uploads/profilePictures/" + file;
    console.log(filePath);
    //comprobar si existe la imagen
    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(404).send( "no existe la imagen")
        }
        //devolver la imagen
        return res.sendFile(path.resolve(filePath));

    });
    
};

const counter = async (req, res) => {
    let studentId = req.student.id;
    if (req.params.id) {
        studentId = req.params.id;
    }
    try {
        const followingCount = await Follow.count({'student': studentId});
        const followedCount = await Follow.count({'followed': studentId});
        const publicationsCount = await Publication.count({'student': studentId});

        return res.status(200).send({
            studentId,
            followingCount,
            followedCount,
            publicationsCount
        })
    } catch (error) {
        return res.status(500).send(error);
    } 

};
module.exports = {
    pruebaStudent,
    register,
    login,
    profile,
    list,
    update,
    uploadImage,
    profilePicture,
    counter
}