import { useState } from "react";
import useAuth from '../../hooks/useAuth'
import { Global } from "../../helpers/Global";
import avatar from '../../assets/img/user.png'
import { SerializeForm } from "../../helpers/SerializeForm";

export const Config = () => {
    
    const {auth, setAuth} = useAuth();
    const [saved, setSaved] = useState('not_saved');

    const token= localStorage.getItem('token');

    const updateUser = async(e) => {
        e.preventDefault();
        //recoger los nuevos datos del formulario
        let newDataStudent = SerializeForm(e.target);
        delete newDataStudent.upload0;
        //actaulizar base de datos
        const request = await fetch(Global.url+'student/update',{
            method: 'PUT',
            body: JSON.stringify(newDataStudent),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const data = await request.json();
        console.log(data);
        if (data.status == 'success' ) {
            delete data.student.password
            setAuth(data.student)
            setSaved('saved');
            console.log(auth)
        }else{
            setSaved('error');
        }

        //subida de imagen
        const fileInput = document.querySelector('#upload');
        console.log(fileInput)

        if (data.status == 'success' && fileInput.files[0]) {
            
            const formData = new FormData();
            formData.append('upload0', fileInput.files[0]);
            
            const uploadRequest = await fetch(Global.url+'student/uploadImage',{
                method: 'POST',
                body: formData,
                headers:{
                    'Authorization': token
                }
            })
            const uploadData = await uploadRequest.json();
            if (uploadData.status == 'success') {
                    delete uploadData.student.password
                    setAuth(uploadData.student);
                    setSaved('saved');
            }else{
                setSaved('error')
            }
        }
    };
    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Ajustes</h1>
            </header>

            <div className="content__posts">
                {saved === 'saved' ?
                    <strong className="alert alert-success">Cambios realizado de forma correcta!</strong>
                    : ""}
                {saved === 'error' ?
                    <strong className="alert alert-danger">Error al realizar cambios!</strong>
                    : ""}
                <form className="config-form" onSubmit={updateUser}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" defaultValue={auth.name}  />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" defaultValue={auth.email}  />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"  />
                    </div>
                    <div className="form-group">
                        <label htmlFor="upload0">Avatar</label>
                        <div className="general-info__container-avatar">
                            {auth.image!='default.png' && <img src={Global.url+'student/profilePicture/'+auth.image} alt="Foto de perfil"/>}
                            {auth.image=='default.png' && <img src={avatar} className="container-avatar__img" alt="Foto de perfil"/>}
                        </div>
                        <br />
                        <input type="file" name="upload0" id="upload" />

                    </div>
                    <br />
                    <input type="submit" value='Actualizar' className="btn btn" />
                </form>
                <br />
            </div>
        </>

    )
}
