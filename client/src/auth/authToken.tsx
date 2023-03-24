import { User } from "../Types/types";

export const authToken = (
  token: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  isLoggedIn: boolean,
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  fetch(`${process.env.REACT_APP_URL}api/user`, requestOptions)
    .then((response) => response.json())
    .then((result) => {return (setUser(result),isLoggedIn === false ? setIsLoggedIn(true): '')})
    .catch((error) => console.log("error", error));
};
