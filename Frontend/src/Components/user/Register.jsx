import { useForm } from "../../hooks/useForm"
import {Global} from '../../helpers/Global'
import { useState } from "react";

export const Register = () => {

    const {form, changed} = useForm({});
    const [saved, setSaved] = useState("not_saved");

    const saveUser = async (e) => {
        e.preventDefault();

        //recoger datos del form
        let newStudent = form;

        //guardar usuario en el backend
        const request = await fetch(Global.url + 'student/register', {
            method: 'POST',
            body: JSON.stringify(newStudent),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data =await request.json();
        if (data.status === 'success') {
            setSaved("saved");
        }else{
            setSaved("error");
        }
    };
    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Registro</h1>
            </header>

            <div className="content__posts">
                {saved === 'saved' ?
                    <strong className="alert alert-success"> Estudiante registrado correctamente!</strong>
                : ""}
                {saved === 'error' ? 
                    <strong className="alert alert-danger">Estudiante no se ha registrado!</strong>
                : ""}

                <form className="register-form" onSubmit={saveUser}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" name="name"  onChange={changed}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" onChange={changed} />
                        </div>
                        <input type="submit" value='Registrate' className="btn btn" />
                </form>
            </div>
        </>
        
    )
}
