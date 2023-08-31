import './IpdateCharacter.css'
import Swal from "sweetalert2/dist/sweetalert2.all.js";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Uploadfile } from "../../components/UploadFile/UploadFile";
import { updateCharacter } from '../../services/API_character/character.service';
import { Navigate, useParams } from "react-router-dom";
import { useUpdateCharacterError } from '../../hooks/Character/useUpdateCharacterError';
import { FigureCharacter } from '../../components/FigureCharacter/FigureCharacter';



export const UpdateCharacter = () => {
    const [okUpdate, setOkUpdate] = useState(false)
    const { register, handleSubmit } = useForm();
    const [res, setRes] = useState({});
    const [send, setSend] = useState(false);
    const { id } = useParams();

    //! ------------ 1) La funcion que gestiona el formulario----
    const formSubmit = (formData) => {
      console.log("entro");
      Swal.fire({
        title: "Are you sure you want to make changes in this character?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(73, 193, 162)",
        cancelButtonColor: "#d33",
        confirmButtonText: "YES",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const inputfile = document.getElementById("file-upload").files;
          let customFormData;
          const idFind = id
          console.log('el id que busco es: ', idFind)
          if (inputfile.length !== 0) {
            customFormData = { ...formData, image: inputfile[0] };
            setSend(true);
            setRes(await updateCharacter(id, customFormData));
            setSend(false);
          } else {
            customFormData = { ...formData };
            setSend(true);
            setRes(await updateCharacter(id, customFormData));
            setSend(false);
          }
        }
      });
    };
  
    //! -------------- 2 ) useEffect que gestiona la parte de la respuesta ------- customHook
  
    useEffect(() => {
      useUpdateCharacterError(res, setRes, setOkUpdate);
    }, [res]);

    //? Si hago autologin podré redirigir a la pagina de profile actualizada sin tener que volverme a registrar
    if (okUpdate == true) {
        return <Navigate to="/characters" />;
    }
    
    return (
      <>
        <div className="containerProfile">
          
          <div className="form-wrap formProfile">
            <h1>Change data character ♻</h1>
            <div className="containerDataNoChange">
              <FigureCharacter id={id} />
            </div>
            <p>Please, enter the changes</p>
            <form onSubmit={handleSubmit(formSubmit)}>
              <div className="user_container form-group">
                <input
                  className="input_user"
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="false"
                  // defaultValue={defaultData?.name}
                  {...register("name")}
                />
                <label htmlFor="custom-input" className="custom-placeholder">
                  character name
                </label>
              </div>
              <div className="user_container form-group">
                <input
                  className="input_user"
                  type="text"
                  id="description"
                  name="description"
                  autoComplete="false"
                  // defaultValue={defaultData?.description}
                  {...register("description")}
                />
                <label htmlFor="custom-input" className="custom-placeholder">
                  description
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