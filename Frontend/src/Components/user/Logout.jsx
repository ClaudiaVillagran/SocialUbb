import { useEffect } from "react"
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
    const {setAuth, setCount} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      localStorage.clear();
    
        setAuth({});
        setCount({});

        navigate('/login');
    })
    
  return (
    <div>Cerrando sesión...</div>
  )
}
