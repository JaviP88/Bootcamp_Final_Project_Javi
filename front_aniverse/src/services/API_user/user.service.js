import { updateToken } from "../../utils/updateToken";
import { APIuser } from "./serviceApiUser.config";

//! ------------------------------- REGISTER -----------------------------------

export const registerUser = async (formData) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "multipart/form-data",
  };

  console.log("formData de register", formData);

  return APIuser.post("/users/register", formData, {
    headers: headers,       // Se mete el archivo files (imagen) para evitar problemas del multiplatform
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ----------------------------- CHECK CODE NEW USER ----------------------------------

export const checkConfirmationCodeUser = async (formData) => {
    return APIuser.post("/users/check", formData)
      .then((res) => res)
      .catch((error) => error);
};

//! --------------------- RESEND CODE --------------------------------
  
export const resendCodeConfirmationUser = async (formData) => {
  console.log(formData);
  return APIuser.post("/users/resend", formData)
    .then((res) => res)
    .catch((error) => error);
};
  
//! --------------------------- LOGIN --------------------------------------------
  
export const loginUser = async (formData) => {
    return APIuser.post("/users/login", formData)
      .then((res) => res)
      .catch((error) => error);
};
  
/* //! ------------------------- AUTO LOGIN ------------------------------------------
  
 export const autoLoginUser = async (formData) => {
    return APIuser.post("/users/login/autologin", formData)
      .then((res) => res)
      .catch((error) => error);
};
   */
//! ------------------------ FORGOT PASSWORD --------------------------------------
export const forgotPasswordUser = async (formData) => {
    return APIuser.patch("/users/forgotpassword", formData)
      .then((res) => res)
      .catch((error) => error);
};
  
//! ----------------------- CHANGE PASSWORD (LOGADOS) ---------------------

export const changePasswordUser = async (formData) => {
    return APIuser.patch("/users/changepassword", formData, {
      headers: {
        Authorization: `Bearer ${updateToken()}`,
      },
    })
      .then((res) => res)
      .catch((error) => error);
};
  
//! --------------------- UPDATE ---------------------------------------
  
export const updateUser = async (formData) => {
    return APIuser.patch("/users/update/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${updateToken()}`,
      },
    })
      .then((res) => res)
      .catch((error) => error);
};
  
//!----------------------- DELETE ---------------------------------------
  
export const deleteUser = async () => {
    return APIuser.delete("/users/", {
      headers: {
        Authorization: `Bearer ${updateToken()}`,
      },
    })
      .then((res) => res)
      .catch((error) => error);
};

//!----------------------- GET USER BY ID ---------------------------------------

export const getUserById = async (id) => {
  return APIuser.get(`/users/getUserById/${id}`)
    .then((res) => res)
    .catch((error) => error);
};

//!----------------------- GET ALL USERS ---------------------------------------

export const getAllUsers = async () => {
  return APIuser.get('/users/')
    .then((res) => res)
    .catch((error) => error);
};

//!----------------------- ADD FAVOURITE CHARACTER ---------------------------------------

export const addFavouriteCharacter = async (id, formData) => {
  return APIuser.post(`/users/addFavouriteCharacter/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

//!----------------------- ADD FAVOURITE MOVIE ---------------------------------------

export const addFavouriteMovie = async (id, formData) => {
  return APIuser.post(`/users/addFavouriteMovie/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};