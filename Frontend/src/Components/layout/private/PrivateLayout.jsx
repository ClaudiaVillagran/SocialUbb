import { Navigate, Outlet } from "react-router-dom"
import { Header } from "./header"
import { Sidebar } from "./Sidebar"
import useAuth from "../../../hooks/useAuth"

export const PrivateLayout = () => {
  const {auth, loading} = useAuth();
  if (loading) {
    return <h1>Cargando...</h1>
  }else{
    return (
      <>
          {/* layout */}

          {/* cabecera */}
          <Header/>

          {/* contenido principal */}
          <section className="layout__content">
            {auth._id ?
                <Outlet/>
              :
                <Navigate to='/login'/>
            }
                
          </section>

          {/* barra lateral */}
          <Sidebar/>
      </>
    )
  }
}
