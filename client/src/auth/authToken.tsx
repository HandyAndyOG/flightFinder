import { User } from "../Types/types";

export const authToken = (
  token: string,
  setUser: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  fetch("http://localhost:8080/api/user", requestOptions)
    .then((response) => response.json())
    .then((result) => setUser(result))
    .catch((error) => console.log("error", error));
};
