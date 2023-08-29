import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useGetCharacterByIdError = (res, setRes, setCharacter) => {

  //! -------- 200 
  
  if (res?.status == 200) {
    console.log('Get character sucessfully')
    setCharacter(() => res?.data)
    setRes({})
  }

  //! -------- 404 = 'We could not find a character with this ID.'
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'We could not find a character with this ID.',
      showConfirmButton: false,
      timer: 3000,
    });
    setRes({})
  }
};