import './CharactersDashboard.css';

import { useEffect, useState } from 'react';
import { getAllCharacters } from '../../services/API_character/character.service';
import { useCharactersDashboardError } from '../../hooks/Character/useCharactersDashboardError';
import { NavLink, Navigate } from 'react-router-dom';
import { CharacterCard } from '../../components/CharacterCard/CharacterCard';



export const CharactersDashboard = () => {
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);

  const createCharacterList = async () => {
    setRes(await getAllCharacters());
  };

  useEffect(() => {
    createCharacterList();
  }, []);

  useEffect(() => {
    useCharactersDashboardError(res, setError);
  }, [res]);

  // redirigimos al dashboard en caso de error en la llamada para mostrar el catalogo
  if (resError) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <NavLink to="/newCharacter">
        <button>Add new character</button>
      </NavLink>

      {res?.data?.length > 0 ? ( // Verifica si la lista tiene elementos
        <ul className='characterList'>
          {res?.data?.map((item) => (
            <li key={item._id}>
              
                <CharacterCard data={item} createCharacterList={createCharacterList} />
              
            </li>
          ))}
        </ul>
      ) : (
        <div>Gallery is empty</div> // Mensaje cuando no hay elementos
      )}
    </div>
  );
};
