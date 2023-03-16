import React, { useEffect, useContext, useState } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { v4 as uuidv4 } from "uuid";
import Nav from "./Nav";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cart = () => {
  const { token, localstorage, setToken, setUser, user, addedToCart, setCartCount, setDeleteFlightCart, deleteFlightCart, isLoggedIn } = useContext(FlightContext);

  const showToastMessage = () => {
    toast.success('Purchased Successfully !', {
        position: toast.POSITION.BOTTOM_CENTER
    });
};

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
          .then((data) => {
            return setUser(data), setCartCount(data.cart.length);
          })
          .catch((err) => console.log(err));
      };
      fetchUsersCart();
    }
  }, [token, localstorage, addedToCart, deleteFlightCart]);

  const removeFromcart = (data: any) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({flightId: data._id}),
    };
    fetch("http://localhost:8080/api/user/cart/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        return data.status==='success' ? setDeleteFlightCart(!deleteFlightCart): '';
      })
      .catch((err) => console.log(err));
  };

  const checkoutFlight = (data: any) => {
    if (data.connectingAirport_connecting_journey) {
      const flightCheckout = {
        connectingFlight: {
          departureAirport_start_journey: {
            flight_id: data.departureAirport_start_journey.flight_id,
          },
          connectingAirport_connecting_journey: {
            flight_id: data.connectingAirport_connecting_journey.flight_id,
          },
        },
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(flightCheckout),
      };
      fetch("http://localhost:8080/api/user/cart/checkout", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          return data.status==='success' ? showToastMessage() : '';
        })
        .catch((err) => console.log(err));
    } else {
      const flightCheckout = {
        directFlight: {
          flight_id: data.flight_id,
        },
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(flightCheckout),
      };
      fetch("http://localhost:8080/api/user/cart/checkout", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          return data.status==='success' ? showToastMessage() : '';
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Nav />
      {isLoggedIn ? 
      <section className="flex flex-col items-center bg-indigo-900 h-screen">
      <article className="w-3/4 mt-5">
        {user ? (
          user?.cart.map((data) => {
            return data?.connectingFlight ? (
              <div
                key={uuidv4()}
                className="flex flex-col p-3 m-1 bg-indigo-100 rounded"
              >
                <div className="grid grid-cols-2 divide-indigo-300 divide-x-2">
                  <div className="p-4 w-full flex flex-col items-end">
                    <div className="flex flex-row justify-between">
                      <p>
                        Flight id:{" "}
                        {
                          data?.connectingFlight
                            ?.connectingAirport_connecting_journey?.flight_id
                        }
                      </p>
                    </div>
                    <h2>Tickets:</h2>
                    <p>
                      {
                        data?.connectingFlight
                          ?.connectingAirport_connecting_journey?.tickets
                          .adultQuantity
                      }{" "}
                      x Adult{" "}
                      {Number(
                        data?.connectingFlight
                          ?.connectingAirport_connecting_journey?.tickets
                          .adultPrice *
                          Number(
                            data?.connectingFlight
                              ?.connectingAirport_connecting_journey?.tickets
                              .adultQuantity
                          )
                      )}
                    </p>
                    <p>
                      {
                        data?.connectingFlight
                          ?.connectingAirport_connecting_journey?.tickets
                          .childQuantity
                      }{" "}
                      x Child{" "}
                      {Number(
                        data?.connectingFlight
                          ?.connectingAirport_connecting_journey?.tickets
                          .childPrice
                      ) *
                        Number(
                          data?.connectingFlight
                            ?.connectingAirport_connecting_journey?.tickets
                            .childQuantity
                        )}
                    </p>
                  </div>
                  <div className="p-4 w-full flex flex-col">
                    <div className="flex flex-row justify-between">
                      <p>
                        Flight id:{" "}
                        {
                          data?.connectingFlight
                            ?.departureAirport_start_journey?.flight_id
                        }
                      </p>
                      <button onClick={() => removeFromcart(data)}           className="border-solid border rounded-full bg-white text-indigo-300 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"
>
                        X
                      </button>
                    </div>
                    <h2>Tickets:</h2>
                    <p>
                      {
                        data?.connectingFlight?.departureAirport_start_journey
                          ?.tickets.adultQuantity
                      }{" "}
                      x Adult{" "}
                      {Number(
                        data?.connectingFlight?.departureAirport_start_journey
                          ?.tickets.adultPrice *
                          Number(
                            data?.connectingFlight
                              ?.departureAirport_start_journey?.tickets
                              .adultQuantity
                          )
                      )}
                    </p>
                    <p>
                      {
                        data?.connectingFlight?.departureAirport_start_journey
                          ?.tickets.childQuantity
                      }{" "}
                      x Child{" "}
                      {Number(
                        data?.connectingFlight?.departureAirport_start_journey
                          ?.tickets.childPrice
                      ) *
                        Number(
                          data?.connectingFlight
                            ?.departureAirport_start_journey?.tickets
                            .childQuantity
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-between border-indigo-300 border-t-2 mt-2 p-1">
                  <h3 className="font-bold">
                    Total:{" "}
                    {Math.round(
                      Number(
                        data?.connectingFlight?.departureAirport_start_journey
                          ?.tickets.adultPrice *
                          Number(
                            data?.connectingFlight
                              ?.departureAirport_start_journey?.tickets
                              .adultQuantity
                          )
                      ) +
                        Number(
                          data?.connectingFlight
                            ?.departureAirport_start_journey?.tickets
                            .childPrice
                        ) *
                          Number(
                            data?.connectingFlight
                              ?.departureAirport_start_journey?.tickets
                              .childQuantity
                          ) +
                        Number(
                          data?.connectingFlight
                            ?.connectingAirport_connecting_journey?.tickets
                            .adultPrice *
                            Number(
                              data?.connectingFlight
                                ?.connectingAirport_connecting_journey
                                ?.tickets.adultQuantity
                            )
                        ) +
                        Number(
                          data?.connectingFlight
                            ?.connectingAirport_connecting_journey?.tickets
                            .childPrice
                        ) *
                          Number(
                            data?.connectingFlight
                              ?.connectingAirport_connecting_journey?.tickets
                              .childQuantity
                          )
                    )}
                  </h3>

                  <button
                    onClick={() => checkoutFlight(data?.connectingFlight)}
                    className="border-solid border rounded-full bg-white text-indigo-300 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={uuidv4()}
                className="flex flex-col bg-indigo-100 rounded p-3 m-1"
              >
                <div className="flex flex-row justify-between">
                  <p>Flight id: {data?.directFlight?.flight_id}</p>
                  <button onClick={() => removeFromcart(data)}           className="border-solid border rounded-full bg-white text-indigo-300 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"
>
                    X
                  </button>
                </div>
                <h2>Tickets:</h2>
                <p>
                  {data?.directFlight?.tickets.adultQuantity} x Adult{" "}
                  {Number(
                    data?.directFlight?.tickets.adultPrice *
                      Number(data?.directFlight?.tickets.adultQuantity)
                  )}
                </p>
                <p>
                  {data?.directFlight?.tickets.childQuantity} x Child{" "}
                  {Number(data?.directFlight?.tickets.childPrice) *
                    Number(data?.directFlight?.tickets.childQuantity)}
                </p>
                <div className="flex flex-row justify-between border-indigo-300 border-t-2 mt-2 p-1">
                  <h3 className="font-bold">
                    Total:{" "}
                    {Math.round(
                      Number(
                        data?.directFlight?.tickets.adultPrice *
                          Number(data?.directFlight?.tickets.adultQuantity)
                      ) +
                        Number(data?.directFlight?.tickets.childPrice) *
                          Number(data?.directFlight?.tickets.childQuantity)
                    )}
                  </h3>
                  <button
                    onClick={() => checkoutFlight(data?.directFlight)}
                    className="border-solid border rounded-full bg-white text-indigo-300 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"

                  >
                    Checkout
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Items in Cart</h1>
        )}
      </article>
      <ToastContainer />
    </section>
      : <h1>Please Login</h1>}
      
    </>
  );
};

export default Cart;
