import React, { createContext, useState } from "react";
import { States, Flights, User } from "../Types/types";


export const FlightContext = createContext<States>({
  allFlights: [],
  setAllFlights: () => {},
  user: null,
  setUser: () => {},
  search: "",
  setSearch: () => {},
  filter: [],
  setFilter: () => {},
  token: "",
  setToken: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  localstorage: "",
  setLocalstorage: () => {},
});

const FlightProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [allFlights, setAllFlights] = useState<Flights[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState<string | undefined>();
  const [filter, setFilter] = useState<string[]>([]);
  const [token, setToken] = useState<string | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [localstorage, setLocalstorage] = useState<string | null>(
    localStorage.getItem("token")
  );
  

  return (
    <FlightContext.Provider
      value={{
        localstorage,
        setLocalstorage,
        token,
        setToken,
        isLoggedIn,
        setIsLoggedIn,
        allFlights,
        setAllFlights,
        user,
        setUser,
        search,
        setSearch,
        filter,
        setFilter,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export default FlightProvider;
