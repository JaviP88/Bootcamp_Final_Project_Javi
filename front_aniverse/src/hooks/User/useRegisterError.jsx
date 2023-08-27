import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useRegisterError = (res, setRegisterOk, setRes, /* setAllUser */) => {
  //? si la respuesta es ok ---- > directamente esta el status en la primera clave es decir: res.status
  //? si la respuesta no esta ok--> res.response.status
 
  //! -------------------------
  //! ----> 201 : todo ok <----
  //! -------------------------

  if (res?.status == 201) {
    const dataToString = JSON.stringify(res);
    const userName = res.data.user.name;
    localStorage.setItem("data", dataToString);
    setRegisterOk(() => true);
    //setAllUser(() => res.data);

    Swal.fire({
      icon: "success",
      title: `${userName} Welcome to Aniverse`,
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! ----------------------------------------
  //! ----> 409: this user already exist <----
  //! ----------------------------------------

  if (res?.response?.status === 409) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Sorry, your mail is not correct!❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! --------------------------------------------------------
  //! ----> La contraseña no esta en el formato correcto <----
  //! --------------------------------------------------------

  if (res?.response?.data?.includes("validation failed: password")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Min 8 characters, 1 upper case, 1 lower case and a special character ❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! ----------------------------------------
  //! ----> Cuando el userName ya existe <----
  //! ----------------------------------------

  if (
    res?.response?.data?.includes(
      "duplicate key error collection: userProyect.users index: name_1 dup key: { name"
    )           //? ----- OJO!! ---- String no valido
  ) {           //! ---------------------------------
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Sorry, this name is already in use ❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! ---------------------------------------
  //! ----> 500 : internal server error <----
  //! ---------------------------------------

  if (res?.response?.status == 500) {

    console.log('La respuesta de 500 es: ', res)
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Interval server error. Please try again ❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! -------------------------------------
  //! ----> 404: 'error, resend code' <----
  //! -------------------------------------

  if (
    res?.response?.status == 404 &&
    res?.response?.data?.confirmationCode.includes("error, resend code")
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Register ok, error to resend code ❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }
};