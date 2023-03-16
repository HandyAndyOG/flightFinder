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
  addedToCart: false,
  setAddedToCart: () => {},
  checkbox: false,
  setCheckbox: () => {},
  deleteFlightCart: false,
  setDeleteFlightCart: () => {},
  localstorage: "",
  setLocalstorage: () => {},
  returnEndDate: null,
  setReturnEndDate: () => {},
  returnStartDate: null,
  setReturnStartDate: () => {},
  departureAt: "",
  setDepartureAt: () => {},
  arrivalAt: "",
  setArrivalAt: () => {},
  cartCount: 0,
  setCartCount: () => {},
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
  const [deleteFlightCart, setDeleteFlightCart] = useState<boolean>(false);
  const [localstorage, setLocalstorage] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [returnStartDate, setReturnStartDate] = useState<Date | null>(null);
  const [returnEndDate, setReturnEndDate] = useState<Date | null>(null);
  const [departureAt, setDepartureAt] = useState<string | undefined>("");
  const [arrivalAt, setArrivalAt] = useState<string | undefined>("");
  const [cartCount, setCartCount] = useState(0);

  return (
    <FlightContext.Provider
      value={{
        deleteFlightCart,
        setDeleteFlightCart,
        cartCount,
        setCartCount,
        arrivalAt,
        setArrivalAt,
        departureAt,
        setDepartureAt,
        returnStartDate,
        setReturnStartDate,
        returnEndDate,
        setReturnEndDate,
        checkbox,
        setCheckbox,
        addedToCart,
        setAddedToCart,
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
