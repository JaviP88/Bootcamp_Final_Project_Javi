import { deleteCharacter, getCharacterById } from "../../services/API_character/character.service";
import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useDeleteCharacterError = ( id, createCharacterList ) => {
  Swal.fire({
    title: "Are you sure you want to delete this character?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(73, 193, 162)",
    cancelButtonColor: "#d33",
    confirmButtonText: "YES",
  }).then(async (result) => {

    console.log(result)

    if (result.isConfirmed) {
      const characterData = await getCharacterById(id)
      const characterName = characterData.data.name
      const res = await deleteCharacter(id);

      
      //const characterName = res.data.character.name;
      switch (res.status) {
        case 200:
          Swal.fire({
            icon: "success",
            title: "Character deleted",
            text: `Bye bye ${characterName} 🖐️`,
            showConfirmButton: false,
            timer: 1500,
          });
          createCharacterList()

          break;
          

        default:
          Swal.fire({
            icon: "error",
            title: "Character was not deleted ❎",
            text: "Please, try again",
            showConfirmButton: false,
            timer: 1500,
          });
          break;
      }
    }
  });
};