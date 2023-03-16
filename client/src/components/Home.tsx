import React, { useContext, useEffect, useState } from "react";
import Search from "./Search";
import { FlightContext } from "../stateManagement/FlightContext";
import FlightCard from "./FlightCard";
import {Link} from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const { token, setToken, localstorage, setUser, addedToCart, allFlights } = useContext(FlightContext);
  const [cartCount, setCartCount] = useState(0)
console.log(allFlights)
  useEffect(() => {
    if (!token && localstorage) {
      setToken(localstorage);
    }

    if (token) {
      const fetchUsersCart = () => {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const requestOptions = {
          method: "GET",
          headers: headers,
        };
        fetch("http://localhost:8080/api/user/cart", requestOptions)
          .then((response) => response.json())
          .then((data) => {return setUser(data), setCartCount(data.cart.length)})
          .catch((err) => console.log(err));
      };
      fetchUsersCart();
    }
  }, [token, localstorage, addedToCart]);

  return (
    <section className='p-9' >
      <nav className='flex flex-row p-3 mb-3 w-full justify-between'>
        <h1>FlightFinder</h1>
        <div className="relative block overflow-hidden w-11 h-11 h-auto">
          {cartCount > 0 ? <span className="absolute left-3 bg-red-600 text-white text-center w-4 h-4 rounded-full border-transparent text-[10px] z-20">
            {cartCount}
          </span> : ''}
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
