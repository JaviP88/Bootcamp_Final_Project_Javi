import './Profile.css'
// import { ChangePassword, FormProfile } from "../components";
import { useAuth } from '../../context/authContext';
import { useDeleteUserError } from '../../hooks/User/useDeleteUserError';
import { useState } from "react";
import { Link } from 'react-router-dom';


export const Profile = () => {
  const [changeRender, setChangeRender] = useState(true);
  const { setUser } = useAuth();

  return (
    <>
      <div className="containerNavProfile">
        <Link to='/changepassword'>
          <img
            src="https://res.cloudinary.com/dq186ej4c/image/upload/v1686125399/pngwing.com_npd5sa.png"
            alt="go to ChangePassword"
            className="iconNav"
            onClick={() => setChangeRender(false)}
          />
        </Link>
        <Link to='/update/update'>
          <img
            src="https://res.cloudinary.com/dq186ej4c/image/upload/v1686125391/Change_User_icon-icons.com_55946_lypx2c.png"
            alt="go to change data profile"
            className="iconNav iconChangeProfile"
            onClick={() => setChangeRender(true)}
          />
        </Link>
        
        <img
          src="https://res.cloudinary.com/dq186ej4c/image/upload/v1686140226/eliminar_user_rmwoeg.png"
          alt="user delete button"
          className={"iconNav iconDeleteUser"}
          onClick={() => useDeleteUserError(setUser)}
        />
      </div>
      {/* <div className="fluidContainerProfile">
        {changeRender ? <FormProfile /> : <ChangePassword />}S
      </div> */}
    </>
  );
};
