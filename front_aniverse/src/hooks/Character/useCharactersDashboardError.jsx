import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useCharactersDashboardError = (res, setError) => {
  
  //! -------- 200 
  
  if (res?.status == 200) {
    console.log('Get all characters sucessfully')
  }


  //! -------- 404 = 'We couldn't get all characters'
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "We couldn't get all characters",
      showConfirmButton: false,
      timer: 3000,
    });

    setError(() => true);
  }
};