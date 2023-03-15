import { User } from "../Types/types";
import { NavigateFn } from '@reach/router';


export const authUser = (
  token: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  navigate: any
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
    .then((result) => {
        return setUser(result),
        result.status === "success"
          ? navigate("/")
          : navigate("/login"),
          console.log(result)
    })
    .catch((error) => console.log("error", error));
};
