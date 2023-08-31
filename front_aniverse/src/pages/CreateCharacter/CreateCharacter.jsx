import './CreateCharacter.css'

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Uploadfile } from "../../components/UploadFile/UploadFile";
import { createCharacter } from '../../services/API_character/character.service';
import { Link, Navigate } from "react-router-dom";
import { useCreateCharacterError } from '../../hooks/Character/useCreateCharacterError';


export const CreateCharacter = () => {
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okRegister, setOkRegister] = useState(false);

  //! ------------------------------------------------------------------------------
  //? 1) funcion que se encarga del formulario - de la data del formulario
  //! ------------------------------------------------------------------------------

  const formSubmit = async (formData) => {
    const inputFile = document.getElementById("file-upload").files;

    if (inputFile.length !== 0) {
      // cuando me han hayan puesto una imagen por el input

      const customFormData = {
        ...formData,
        image: inputFile[0],
      };

      setSend(true);
      setRes(await createCharacter(customFormData));
      setSend(false);

      //! me llamo al servicio
    } else {
      const customFormData = {
        ...formData,
      };

      setSend(true);
      setRes(await createCharacter(customFormData));
      setSend(false);

      ///! me llamo al servicio
    }
  };

  //! ------------------------------------------------------------------------------
  //? 2) funcion que se encarga del formulario- de la data del formulario
  //! ------------------------------------------------------------------------------
  useEffect(() => {
    console.log('res: ', res);
    useCreateCharacterError(res,  setOkRegister, setRes);
  }, [res]);

  //! ------------------------------------------------------------------------------
  //? 3) Estados de navegacion ----> lo veremos en siguiente proyectos
  //! ------------------------------------------------------------------------------

  if (okRegister) {
    console.log("res", res);
    console.log("Character create");
    return <Navigate to="/charactersDashboard" />;
  }

  return (
    <>
      <div className="form-wrap">
        <h1>Create a new character</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="name_container form-group">
            <input
              className="input_character"
              type="text"
              id="name"
              name="name"
              autoComplete="false"
              {...register("name", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              character name
            </label>
          </div>
          <div className="description_container form-group">
            <input
              className="input_character"
              type="text"
              id="description"
              name="description"
              autoComplete="false"
              {...register("description", { required: true })}
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
              style={{ background: send ? "#49c1a388" : "#2f7a67" }}
            >
              {send ? "Creating character..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};