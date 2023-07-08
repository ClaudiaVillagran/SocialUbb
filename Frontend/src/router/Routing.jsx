import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { PublicLayout } from '../Components/layout/public/PublicLayout';
import { Login } from '../Components/user/Login';
import { Register } from '../Components/user/Register';
import { PrivateLayout } from '../Components/layout/private/PrivateLayout';
import { Feed } from '../Components/publication/Feed';
import { AuthProvider } from '../context/AuthProvider';
import { Logout } from '../Components/user/Logout';
import { User } from '../Components/user/User';
import { Config } from '../Components/user/Config';

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path='/' element={<PublicLayout/>}>
                <Route index element={<Login/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path='registro' element={<Register/>}/>
            </Route>

            <Route path='/social' element={<PrivateLayout/>}>
              <Route index element={<Feed/>}/>
              <Route path='feed' element={<Feed/>}/>
              <Route path='logout' element={<Logout/>}/>
              <Route path='users' element={<User/>}/>
              <Route path='config' element={<Config/>}/>
            </Route>

            <Route path='*' element={
              <>
                <p>
                  <h1>ERROR 404</h1>
                  <Link to='/'>Volver al inicio</Link>
                </p>
              </>
            }
            />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
