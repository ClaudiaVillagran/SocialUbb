import { createContext, useEffect, useState } from "react";
import { Global } from "../helpers/Global";

const AuthContext  = createContext();

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [count, setCount] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authStudent();
    },[]);
    
    const authStudent = async () =>{
        //sacar datos del usuario identificado del localStorage
        const token = localStorage.getItem('token');
        const student = localStorage.getItem('student');
        //comprobar si tengo el token
        if (!token || !student) {
            return false;
        }
        //trasnformar los datos a un obj js
        const studentObj= JSON.parse(student);
        const studentId = studentObj.id;

        //peticion ajax al backend que compruebe el token y devuelva los datos
        const request = await fetch(Global.url+'student/profile/'+ studentId,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        
        const data = await request.json();

        //peticion para los contadores
        const requestCounter = await fetch(Global.url+'student/counter/'+ studentId,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const dataCounter = await requestCounter.json();

        //setear eñ estado auth
        setAuth(data.student)
        setCount(dataCounter);
        setLoading(false);
    }
  return (
    <AuthContext.Provider value={{auth, setAuth, count,setCount, loading}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
