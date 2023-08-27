import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { ButtonReSend } from '../../components/ButtonResend/ButtonResend';
import { useVerifyCodeError } from '../../hooks/User/useVerifyCodeError';
import { checkConfirmationCodeUser } from '../../services/API_user/user.service';


export const VerifyCode = () => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [reloadPageError, setReloadPageError] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [okCheck, setOkCheck] = useState(false);
  const { allUser, setUser, user } = useAuth();
  const { register, handleSubmit } = useForm();

  //! 1) ---------------LAS FUNCIONES QUE GESTIONAN LOS SUBMIT DE LOS FORMULARIOS--------
  
  const formSubmit = async (formData) => {
    const userLocal = localStorage.getItem('user');

    if (userLocal == null) {
      /// -----> este usuario viene del registro porque no se a logado previamente
      /// ---> recordar alllUser es la res que recibo del registro, solo disponible cuando he echo un registro previo
      const customFormData = {
        email: allUser.data.user.email,
        confirmationCode: parseInt(formData.confirmationCode),
      };

      //! llamada al servicio
      setSend(true);
      setRes(await checkConfirmationCodeUser(customFormData));
      setSend(false);
    } else {
      // ------> este usuario viene del login porque existe en el local storage
      const customFormData = {
        email: user.email,
        confirmationCode: parseInt(formData.confirmationCode),
      };

      //! llamada al servicio
      setSend(true);
      setRes(await checkConfirmationCodeUser(customFormData));
      setSend(false);
    }
  };

  //!2) ---------------- USEEFFECT  QUE GESTIONAN LOS ERRRORES Y EL 200 CON UN CUSTOMhook -----
  
  useEffect(() => {
    useVerifyCodeError(
      res,
      setDeleteUser,
      setUser,
      setReloadPageError,
      setRes,
      setOkCheck,
    );
  }, [res]);

  //!3) ----------------- ESTADOS DE NAVEGACION O DE CONFIRMACION DE QUE LA FUNCIONALIDAD ESTA OK ----

  if (okCheck) {
    console.log('entro');
    return <Navigate to="/login" />;
  }

  if (deleteUser) {
    return <Navigate to="/register" />;
  }

  if (reloadPageError) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="form-wrap">
        <h1>Verify your code 👌</h1>
        <p>Write the code sent to your email</p>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <input
              className="input_user"
              type="text"
              id="name"
              name="name"
              autoComplete="false"
              {...register('confirmationCode', { required: false })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Registration code
            </label>
          </div>

          <div className="btn_container">
            <button id="btnCheck" className="btn" type="submit" disabled={send}>
              Verify Code
            </button>
          </div>
        </form>
        <div className="btn_container">
          <ButtonReSend setReloadPageError={setReloadPageError} />
        </div>
        <p className="bottom-text">
          <small>
            If the code is not correct ❌, your user will be deleted from the database and
            you will need to register again.{' '}
          </small>
        </p>
      </div>
    </>
  );
};