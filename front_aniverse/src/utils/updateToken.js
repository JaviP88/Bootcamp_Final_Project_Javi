export const updateToken = () => {
    const user = localStorage.getItem('user');      //! Ahora se guarda en el localStorage, en un futuro se guardará en el session
    if (user) {
      const parseUser = JSON.parse(user);
      return parseUser.token;
    }
  };