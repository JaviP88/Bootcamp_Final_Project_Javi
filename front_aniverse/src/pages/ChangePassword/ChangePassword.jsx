import "./ChangePassword.css"
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useChangePasswordError } from "../../hooks/User/useChangePasswordError";

import { changePasswordUser } from "../../services/API_user/user.service";
import { useAuth } from "../../context/authContext";
import { Navigate } from "react-router-dom";
// import ChangeUserName from "../../components/changeUserName/ChangeUserName";
// import ChangeProfilePic from "../../components/ChangeProfilePic/ChangeProfilePic";
// import useDeleteUser from "../../hooks/useDeleteUser";





export const ChangePassword = () => {
  const {user, setUser } = useAuth();
  const [okChange, setOkChange] = useState(false)
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
const token = user?.token;


  //! -----------------1) FUNCIÓN PARA GESTIONAR EL FORMULATIO

  const formSubmit = (formData) => {

 
    const { password, newPassword, confirmPassword } = formData;
    if (newPassword === confirmPassword) {
      Swal.fire({
        title: "Are you sure you want to change your password?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(73, 193, 162)",
        cancelButtonColor: "#d33",
        confirmButtonText: "YES",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSend(true);
          setRes(await changePasswordUser({ password, newPassword, token}));
          setSend(false);
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Password dont match",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  //! ------------------2) GESTION DE LA RESPUESTA POR EL CUSTOMHOOK Y AYUDADO POR EL USEEFFECT

  useEffect(() => {
    console.log(res);
    useChangePasswordError(res, setRes, setUser, setOkChange);
  }, [res]);

  if (okChange == true) {
    
    return <Navigate to="/login" />;}
    


  return (
    <>
    <div className="passwordChange-container">
      <div className="form-wrap">
      <div className="changePassWrap">
        <h1>Change your password ♻</h1>
        <p>Please, enter your old and new passwords</p>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="password_container form-group">
            <input
              className="input_user"
              type="password"
              id="password"
              name="password"
              autoComplete="false"
              {...register("password", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Old password
            </label>
          </div>
          <div className="newPassword_container form-group">
            <input
              className="input_user"
              type="password"
              id="newPassword"
              name="newPassword"
              autoComplete="false"
              {...register("newPassword", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              New password
            </label>
          </div>
          <div className="confirmPassword_container form-group">
            <input
              className="input_user"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="false"
              {...register("confirmPassword", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Confirm new password
            </label>
          </div>
          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#49c1a2" }}
            >
              CHANGE PASSWORD
            </button>
          </div>
        </form>
        </div>
      </div>
      
      {/* <ChangeUserName/>
      <ChangeProfilePic/> */}

      {/* <h3
        className=" textDeleteUser"
        onClick={() => useDeleteUser(setUser, user)}
      >
        Delete your account
      </h3> */}
    </div>
    </>
  );
};