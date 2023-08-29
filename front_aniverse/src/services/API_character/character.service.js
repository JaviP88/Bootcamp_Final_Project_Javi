import { useParams } from "react-router-dom";
import { updateToken } from "../../utils/updateToken";
import { APIcharacter } from "./serviceApiCharacter.config";


//! ------------------------------- CREATE NEW CHARACTER -----------------------------------

export const createCharacter = async (formData) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    };
  
    console.log("formData de createCharacter", formData);
  
    return APIcharacter.post("/characters/newCharacter", formData, {
      headers: headers,
      Authorization: `Bearer ${updateToken()}`,       // Se mete el archivo files (imagen) para evitar problemas del multiplatform
    })
      .then((res) => res)
      .catch((error) => error);
  };

//! ------------------------------- UPDATE CHARACTER -----------------------------------

export const updateCharacter = async (_id , formData) => {
    return APIcharacter.patch(`/characters/updateCharacter/${_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${updateToken()}`,
      },
    })
      .then((res) => res)
      .catch((error) => error);
};

//! ------------------------------- DELETE CHARACTER -----------------------------------

export const deleteCharacter = async (id) => {
    return APIcharacter.delete(`/characters/${id}`, {
      headers: {
        Authorization: `Bearer ${updateToken()}`,
      },
    })
      .then((res) => res)
      .catch((error) => error);
};

//! ------------------------------- GET CHARACTER BY ID -----------------------------------

export const getCharacterById = async (id) => {
    return APIcharacter.get(`/characters/${id}`)
      .then((res) => res)
      .catch((error) => error);
  };

//! ------------------------------- GET ALL CHARACTERS -----------------------------------

export const getAllCharacters = async () => {
    return APIcharacter.get(`/characters/allCharacters/allCharacters`)
      .then((res) => res)
      .catch((error) => error);
  };

//! ------------------------------- ADD MOVIE TO A CHARACTER -----------------------------------

export const addMovieToACharacter = async () => {
    return APIcharacter.post(`/characters/addMovieToCharacter`)
      .then((res) => res)
      .catch((error) => error);
  };