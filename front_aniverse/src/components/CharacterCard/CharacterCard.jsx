import { Link } from 'react-router-dom';
import './CharacterCard.css'
// import { Link } from 'react-router-dom';


export const CharacterCard = ({data}) => {
    const { _id, name, image } = data;
    // const pathCustom = `/characters/${_id}`;
    return (
    //   <Link to={pathCustom}>
        <figure>
          <Link to={`/updateCharacter/${_id}`}>Update</Link>
          <img src={image} alt={name} />
          <h3>{name}</h3>
        </figure>
    //   </Link>
    );
}
