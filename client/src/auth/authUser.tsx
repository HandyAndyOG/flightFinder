import { User } from "../Types/types";

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
        return (setUser(result),
        result.status === "success"
          ? navigate("/")
          : navigate("/login")
    )})
    .catch((error) => console.log("error", error));
};
