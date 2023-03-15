import React, { useContext, useEffect } from "react";
import Search from "./Search";
import { FlightContext } from "../stateManagement/FlightContext";
import FlightCard from "./FlightCard";
import {Link} from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const { token, setToken, localstorage } = useContext(FlightContext);
  useEffect(() => {
    if (!token && localstorage) {
      setToken(localstorage);
    }
  });

  return (
    <section className='p-9' >
      <nav className='flex flex-row p-3 mb-3 w-full justify-between'>
        <h1>FlightFinder</h1>
        <div className="relative block overflow-hidden w-11 h-11 h-auto">
          <span className="absolute left-3 bg-red-600 text-white text-center w-4 h-4 rounded-full border-transparent text-[10px] z-20">
            1
          </span>
          <Link to={'/cart'}>
            <FaShoppingCart className="relative top-1 text-2xl z-10" />
          </Link>
        </div>
      </nav>

      <Search />
      <FlightCard />
    </section>
  );
};

export default Home;
