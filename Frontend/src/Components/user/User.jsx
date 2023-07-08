import { useEffect } from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
import { useState } from 'react'
export const User = () => {

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getStudents(1);
  }, []);

  const getStudents = async (next = 1) => {
    setLoading(true)
    //peticion para sacar estudiantes
    const request = await fetch(Global.url + 'student/list/'+next, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    //crear un estado para poder listarlos
    if (data.students && data.status == 'success') {
      let newStudents =  data.students;
      if (students.length >=1) {
        newStudents=[...students, ...data.students];
      }
      setStudents(newStudents)
      setLoading(false)
      //paginacion
      if (students.length>=(data.total - data.students.length)) {
        setMore(false);
      }
    }
  }
  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getStudents(next);
  };
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios</h1>
      </header>

      <div className="content__posts">
        { loading ? <h1>CARGANDO...</h1>  :''}
        {students.map(student => {
          return (
            <article className="posts__post" key={student._id}>

              <div className="post__container">

                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    {student.image=='default.png' ? 
                      <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                      :''
                    }
                    {student.image!='default.png'?
                      <img src={Global.url+'student/profilePicture/'+student.image} className="post__user-image" alt="Foto de perfil" />
                      :''
                    }

                  </a>
                </div>

                <div className="post__body">

                  <div className="post__user-info">
                    <a href="#" className="user-info__name">{student.name}</a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">{student.created_at}</a>
                  </div>
                </div>

              </div>


              <div className="post__buttons">

                <a href="#" className="post__button post__button--green">
                  Seguir
                </a>
                {/* <a href="#" className="post__button ">
              Dejar de seguir
            </a> */}
              </div>
              
            </article>

          )
        })}


      </div>
      {more &&
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas personas
          </button>
        </div>
      }
      
      <br />
    </>
  )
}
