const bcrypt = require("bcrypt")
const Student = require('../models/student')
const jwt = require('../services/jwt')

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

module.exports = {
    pruebaStudent,
    register,
    login
}