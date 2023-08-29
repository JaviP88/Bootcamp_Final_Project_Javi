import { useParams } from "react-router-dom";
import "./FigureCharacter.css";
import { useEffect, useState } from "react";
import { getCharacterById } from "../../services/API_character/character.service";
import { useGetCharacterByIdError } from "../../hooks/Character/useGetCharacterByIdError";



export const FigureCharacter = (id) => {
  const [res, setRes] = useState(null);
  const [character, setCharacter] = useState({})


  const findCharacter = async (id) => {
    setRes(await getCharacterById(id.id));
  };


  useEffect(() => {
    findCharacter(id);
    console.log('id es: ', id)
  }, [id]);
  useEffect(() => {
    console.log('character es: ', character)
  }, [character]);
  useEffect(() => {
    useGetCharacterByIdError(res, setRes, setCharacter);

  }, [res]);
  

  return (
    <figure className="dataCharacter">
      <img src={character.image} alt="character image" className="imageCharacter" />
      <h4 className="nameCharacter">{character.name}</h4>
    </figure>
  );
};