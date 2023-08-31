import { Link } from 'react-router-dom';
import './CharacterCard.css'
import { useDeleteCharacterError } from '../../hooks/Character/useDeleteCharacterError';


export const CharacterCard = ({data, createCharacterList}) => {
    const { _id, name, image } = data;
    
    return (
        <figure className='characterCard'>
          <div className='upperBtn'>
            <Link to={`/updateCharacter/${_id}`}>Update</Link>
            <button onClick={() => useDeleteCharacterError(_id, createCharacterList)}>Delete</button>
          </div>
          
          <Link to={`/characters/${_id}`}>
            <img className='characterImage' src={image} alt={name} />
          </Link>
          
          <h3>{name}</h3>
        </figure>
    );
}
