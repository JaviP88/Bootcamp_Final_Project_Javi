import './UpdateUser.css'
import Swal from "sweetalert2/dist/sweetalert2.all.js";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Uploadfile } from "../../components/UploadFile/UploadFile";
import { updateUser } from "../../services/API_user/user.service";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useUpdateError } from '../../hooks/User/useUpdateError';
import { FigureUser } from '../../components/FigureUser/FigureUser';


export const UpdateUser = () => {
    const { user, setUser, logout } = useAuth();
    const [okUpdate, setOkUpdate] = useState(false)
    const { register, handleSubmit } = useForm();
    const [res, setRes] = useState({});
    const [send, setSend] = useState(false);
  
    const defaultData = {
      name: user?.user,
    };
  
    //! ------------ 1) La funcion que gestiona el formulario----
    const formSubmit = (formData) => {
      console.log("entro");
      Swal.fire({
        title: "Are you sure you want to change your data profile?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(73, 193, 162)",
        cancelButtonColor: "#d33",
        confirmButtonText: "YES",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const inputfile = document.getElementById("file-upload").files;
          let customFormData;
  
          if (inputfile.length !== 0) {
            customFormData = { ...formData, image: inputfile[0] };
            setSend(true);
            setRes(await updateUser(customFormData));
            setSend(false);
          } else {
            customFormData = { ...formData };
            setSend(true);
            setRes(await updateUser(customFormData));
            setSend(false);
          }
        }
      });
    };
  
    //! -------------- 2 ) useEffect que gestiona la parte de la respuesta ------- customHook
  
    useEffect(() => {
      console.log(res);
      useUpdateError(res, setRes, setUser, logout, setOkUpdate);
    }, [res]);

    //? Si hago autologin podré redirigir a la pagina de profile actualizada sin tener que volverme a registrar
    // if (okUpdate == true) {
    //     return <Navigate to="/profile" />;
    // }
  
    return (
      <>
        <div className="containerProfile">
          <div className="containerDataNoChange">
            <FigureUser user={user} />
          </div>
          <div className="form-wrap formProfile">
            <h1>Change your data profile ♻</h1>
            <p>Please, enter your new data profile</p>
            <form onSubmit={handleSubmit(formSubmit)}>
              <div className="user_container form-group">
                <input
                  className="input_user"
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="false"
                  defaultValue={defaultData?.name}
                  {...register("name")}
                />
                <label htmlFor="custom-input" className="custom-placeholder">
                  username
                </label>
              </div>
              <div className="geder_container form-group">
            <input
              type="radio"
              name="sexo"
              id="hombre"
              value="hombre"
              {...register("gender")}
            />
            <label htmlFor="hombre" className="label-radio hombre">
              Hombre
            </label>
            <input
              type="radio"
              name="sexo"
              id="mujer"
              value="mujer"
              {...register("gender")}
            />
            <label htmlFor="mujer" className="label-radio mujer">
              Mujer
            </label>
          </div>
              <Uploadfile />
              <div className="btn_container">
                <button
                  className="btn"
                  type="submit"
                  disabled={send}
                  style={{ background: send ? "#49c1a388" : "#49c1a2" }}
                >
                  {send ? "Updating..." : "Change data profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
}