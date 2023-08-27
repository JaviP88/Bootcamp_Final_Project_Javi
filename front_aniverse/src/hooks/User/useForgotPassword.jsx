import Swal from "sweetalert2/dist/sweetalert2.all.js";


export const useForgotPassword = (res, setRes, setForgotOk) => {


  //! --------------------------------------------------------
  //! ----> 200 ={ updateUser: true, sendPassword: true} <----
  //! --------------------------------------------------------

  if (res?.status == 200) {
    if (res?.data?.sendPassword == true && res?.data?.updateUser == true) {
      setForgotOk(() => true);
      setRes(() => ({}));
      Swal.fire({
        icon: "success",
        title: "Change password successfully",
        text: "We have sent an email with your new password ✅",
        showConfirmButton: false,
        timer: 3000,
      });
      setRes(() => {});
    }
  }

  //!-----------------------------------------------------------
  //! ----> 404 = { updateUser: false, sendPassword: true} <----
  //!-----------------------------------------------------------
  
  if (
    res?.response?.data?.sendPassword == true &&
    res?.response?.data?.updateUser == false
  ) {
    setRes(() => ({}));
    Swal.fire({
      icon: "error",
      title: "Incorrect email",
      text: "We don't change your password, your email is invalid ❎",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

  //!-------------------------------------
  //! ----> 404 = 'User no register' <----
  //!-------------------------------------


  if (res?.response?.data?.includes("User is not registered with this email")) {
    setRes(() => ({}));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter a valid email address ❎",
      showConfirmButton: false,
      timer: 3000,
    });
    setRes(() => {});
  }

  //! -------- 404 = 'dont send email and dont update user'
  if (res?.response?.data?.includes("you do not sent the email and you do not update the user")) {
    setRes(() => ({}));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No update password,  ❎ Try again, please",
      showConfirmButton: false,
      timer: 3000,
    });
    setRes(() => {});
  }

  //! -------- 500 = interval server error
  if (res?.response?.status == 500) {
    setRes(() => ({}));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Internal server error ❎, please try again ",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }
};