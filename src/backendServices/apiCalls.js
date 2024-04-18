import axios from "axios";

export const deleteUserData = async (userId) => {
    await axios.delete(
      `https://6620886e3bf790e070afed2d.mockapi.io/crud/${userId}`
    );
  };