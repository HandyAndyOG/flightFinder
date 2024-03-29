import React, { useContext, useEffect } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Nav = () => {
  const {
    cartCount,
    token,
    localstorage,
    setLocalstorage,
    setIsLoggedIn,
    setToken,
    setUser,
    setCartCount,
    addedToCart,
    deleteFlightCart,
    isLoggedIn
  } = useContext(FlightContext);
  const navigate = useNavigate();

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
        fetch(`${process.env.REACT_APP_URL}api/user/cart`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            return (setUser(data), setCartCount(data.cart.length));
          })
          .catch((err) => console.log(err));
      };
      fetchUsersCart();
    }
  }, [token, localstorage, addedToCart, deleteFlightCart, setCartCount, setToken, setUser]);

  const logout = () => {
    setLocalstorage('')
    localStorage.clear();
    setToken('');
    setUser(null);
    setIsLoggedIn(!isLoggedIn)
    setCartCount(0)
    navigate('/')
  }

  const login = () => {
    navigate('/login');
  }

  const register = () => {
    navigate('/register');
  }

  return (
    <nav className="flex flex-row p-5 justify-evenly items-start z-10 shadow-md bg-indigo-200">
      <Link to={'/'}>
        <h1 className='py-1 px-4'>FlightFinder</h1>
      </Link>
      {isLoggedIn ? <button onClick={logout} className="border rounded-full py-1 px-4 shadow bg-indigo-600 text-white ease-in-out duration-300 hover:bg-white hover:text-indigo-600">Logout</button> : <button onClick={login} className="border rounded-full py-1 px-4 shadow bg-indigo-600 text-white ease-in-out duration-300 hover:bg-white hover:text-indigo-600">Login</button>}
      {isLoggedIn ? '' : <button onClick={register} className="border rounded-full py-1 px-4 shadow bg-indigo-600 text-white ease-in-out duration-300 hover:bg-white hover:text-indigo-600">Register</button>}
      <div className="relative block overflow-hidden w-12 h-12 h-auto py-1 px-4">
        {cartCount > 0 ? (
          <span className="animate-bounce absolute left-8 top-1.5 bg-indigo-600 text-white text-center w-4 h-4 rounded-full border-transparent text-[10px] z-20">
            {cartCount}
          </span>
        ) : (
          ""
        )}
        <Link to={"/cart"}>
          <FaShoppingCart className="relative top-1 text-2xl z-10" />
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
