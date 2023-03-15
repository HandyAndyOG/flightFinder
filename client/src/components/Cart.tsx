import React, { useEffect, useContext, useState } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { v4 as uuidv4 } from "uuid";

const Cart = () => {
  const { token, localstorage, setToken, user, setUser } =
    useContext(FlightContext);

  useEffect(() => {
    if (!token && localstorage) {
      setToken(localstorage);
    }
  }, []);
  useEffect(() => {
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
          .then((data) => setUser(data))
          .catch((err) => console.log(err));
      };
      fetchUsersCart();
    }
  }, [token]);

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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
  
      const requestOptions = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(flightCheckout)
      };
        fetch("http://localhost:8080/api/user/cart/checkout", requestOptions)
        .then((response) => response.json())
        .then((data) => { console.log(data)})
        .catch((err) => console.log(err))
    } else {
      const flightCheckout = {
        directFlight: {
          flight_id: data.flight_id,
        },
      };
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
  
      const requestOptions = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(flightCheckout)
      };
        fetch("http://localhost:8080/api/user/cart/checkout", requestOptions)
        .then((response) => response.json())
        .then((data) => { console.log(data)})
        .catch((err) => console.log(err))
    }
  };

  return (
    <section>
      <article>
        {user ? (
          user?.cart.map((data) => {
            return data?.connectingFlight ? (
              <div
                key={uuidv4()}
                className="flex flex-col border rounded p-3 m-1"
              >
                <div className="grid grid-cols-2 divide-x-2">
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
                  <div className="p-4 w-full flex flex-col items-start">
                    <div className="flex flex-row justify-between">
                      <p>
                        Flight id:{" "}
                        {
                          data?.connectingFlight?.departureAirport_start_journey
                            ?.flight_id
                        }
                      </p>
                      <button className="">X</button>
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
                          data?.connectingFlight?.departureAirport_start_journey
                            ?.tickets.childQuantity
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-between border-t-2 mt-2 p-1">
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
                          data?.connectingFlight?.departureAirport_start_journey
                            ?.tickets.childPrice
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
                                ?.connectingAirport_connecting_journey?.tickets
                                .adultQuantity
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
                    className="border rounded w-28 self-end"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={uuidv4()}
                className="flex flex-col border rounded p-3 m-1"
              >
                <div className="flex flex-row justify-between">
                  <p>Flight id: {data?.directFlight?.flight_id}</p>
                  <button className="">X</button>
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
                <div className="flex flex-row justify-between border-t-2 mt-2 p-1">
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
                    className="border rounded w-28 self-end"
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
    </section>
  );
};

export default Cart;