import React, { useContext, useEffect } from "react";
import Search from "./Search";
import { FlightContext } from "../stateManagement/FlightContext";
import FlightCard from "./FlightCard";

const Home = () => {
  const { token, setToken, localstorage } = useContext(FlightContext);
  useEffect(() => {
    if (!token && localstorage) {
      setToken(localstorage);
    }
  });

  return (
    <>
      <div>FlightFinder</div>
      <Search />
      <FlightCard />
    </>
  );
};

export default Home;
