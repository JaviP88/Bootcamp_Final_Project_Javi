import Swal from "sweetalert2/dist/sweetalert2.all.js";


export const useLoginError = (res, setLoginOk, userLogin, setRes) => {
  //? si la respuesta es ok ---- > directamente esta el status en la primera clave es decir: res.status
  //? si la respuesta no esta ok--> res.response.status

  //! -------------------------
  //! ----> 200 : todo ok <----
  //! -------------------------

  if (res?.status == 200) {
    const dataCustom = {
      token: res.data.token,
      user: res.data.user.name,
      gender: res.data.user.gender,
      rol: res.data.user.rol,
      email: res.data.user.email,
      _id: res.data.user._id,
      image: res.data.user.image,
      checkConfrmationCode: res.data.user.checkConfrmationCode,
    };

    const userName = res.data.user.name;
    const dataString = JSON.stringify(dataCustom);
    userLogin(dataString);
    setLoginOk(() => true);
    Swal.fire({
      icon: "success",
      title: `${userName} we are glad tu see you again 😁`,
      text: "Login ok ✅",
      showConfirmButton: false,
      timer: 1500,
    });
    //? setRes(() => {});     ------> No se borra la respuesta porque si no, no podemos obtener los datos que hemos sacado. <---------
  }

  //! --------------------------------------
  //! ----> 404: 'password dont match' <----
  //! --------------------------------------

  if (res?.response?.data?.includes("Invalid password")) {
    setRes(() => {});
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Password does't match ❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

  //! -----------------------------------
  //! ----> 404: 'User no register' <----
  //! -----------------------------------

  if (res?.response?.data?.includes("User not found")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "This user is not register ❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

  //! --------------------------------------
  //! ----> 500: INTERNAL SERVER ERROR <----
  //! --------------------------------------

  if (res?.response?.status == 500) {
    setRes(() => {});
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Interval Server Error ❎!",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }
};