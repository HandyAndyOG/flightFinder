import React, { useContext, useState } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { v4 as uuidv4 } from "uuid";
import { seeFlight } from "../helperFunctions/seeFlights";
import { seats } from "../helperFunctions/seats";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { bookFlight } from "../helperFunctions/bookFlights";
import { flightTime } from "../helperFunctions/flightTime";
import { searchReturnFlight } from "../helperFunctions/searchReturnFlight";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FlightData {
  [key: string]: boolean;
}

const Oneway = () => {
  const {
    allFlights,
    token,
    addedToCart,
    setAddedToCart,
    checkbox,
    setAllFlights,
    returnStartDate,
    returnEndDate,
    departureAt,
    arrivalAt,
  } = useContext(FlightContext);

  const showToastMessage = () => {
    toast.success('Added to Cart!', {
        position: toast.POSITION.BOTTOM_CENTER
    });
};

  const [clicked, setClicked] = useState<FlightData>({});
  const [selectedChildOption, setSelectedChildOption] = useState("");
  const [selectedAdultOption, setSelectedAdultOption] = useState("");
  const [selectedChildConnectingOption, setSelectedChildConnectingOption] =
    useState("");
  const [selectedAdultConnectingOption, setSelectedAdultConnectingOption] =
    useState("");
  const [selectedAdultDirectOption, setSelectedAdultDirectOption] =
    useState("");
  const [selectedChildDirectOption, setSelectedChildDirectOption] =
    useState("");

  return (
    <section className="flex items-center flex-col w-3/4  rounded">
      {allFlights ? (
        allFlights.map((flights) => {
          return (
            <article key={uuidv4()} className="w-full">
              {flights.itineraries.map((data) => {
                return (
                  <>
                    <article
                      key={uuidv4()}
                      className=" p-3 mb-1 bg-indigo-400 rounded-lg text-white shadow"
                      onClick={() => seeFlight(data, setClicked)}
                    >
                      {data.connectingAirport_connecting_journey &&
                      data.departureAirport_start_journey ? (
                        <>
                          <div>
                            <div className="flex flex-row items-center border-b-2 pb-2 justify-start mb-2">
                            <h2 className="px-4 text-indigo-900">{flights.departureDestination}</h2>
                            <FaPlaneDeparture className="text-indigo-900"/>
                            <h2 className="px-4 text-indigo-900">
                              {flights.intermediateDestination}
                            </h2>
                            </div>
                            <p className="p-5">
                              Estimated price: ~
                              {
                                data.connectingAirport_connecting_journey.prices
                                  .currency
                              }
                              {Math.round(
                                data.connectingAirport_connecting_journey.prices
                                  .adult +
                                  data.departureAirport_start_journey.prices
                                    .adult
                              )}
                            </p>
                          </div>
                          <div>
                            <div className="flex flex-row items-center border-t-2 pt-2 justify-end mt-2">
                              <h2 className="px-4 text-indigo-900">{flights.intermediateDestination}</h2>
                              <FaPlaneArrival className="text-indigo-900"/>
                            <h2 className="px-4 text-indigo-900">
                              {flights.arrivalDestination}
                            </h2>
                            </div>
                          </div>
                        </>
                      ) : (
                        <article key={uuidv4()}>
                          <div className="flex flex-row items-center border-b-2 pb-2 justify-center mb-2">
                            <h2 className="px-4 text-indigo-900">{flights.departureDestination}</h2>
                            {<FaPlaneDeparture className="text-indigo-900"/>}
                          <h2 className="px-4 text-indigo-900">
                            {flights.arrivalDestination}
                          </h2>
                          </div>
                          <p className="p-5">
                            Estimated Price: ~{data.prices.currency}
                            {Math.round(data.prices.adult)}
                          </p>
                        </article>
                      )}
                    </article>
                    {clicked[data._id] &&
                      (data.connectingAirport_connecting_journey ? (
                        <article className="flex flex-col border rounded-lg bg-indigo-200 py-3 px-3 mb-3">
                          <div className=" grid grid-cols-2 divide-x-2">
                            <div className="p-4 w-full flex flex-col items-end">
                            <div className="flex flex-row items-center border-b-2 pb-2 justify-start mb-2">
                            <h2 className="px-4 text-indigo-900">{flights.departureDestination}</h2>
                            <FaPlaneDeparture className="text-indigo-900"/>
                            <h2 className="px-4 text-indigo-900">
                              {flights.intermediateDestination}
                            </h2>
                            </div>
                              <h3>
                                Flight id:{" "}
                                {data.departureAirport_start_journey.flight_id}
                              </h3>
                              <h3>
                                Departure:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(
                                  new Date(
                                    data.departureAirport_start_journey.departureAt
                                  )
                                )}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(
                                  new Date(
                                    data.departureAirport_start_journey.departureAt
                                  )
                                )}
                              </h3>
                              <h3>
                                Arrival:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(
                                  new Date(
                                    data.departureAirport_start_journey.arrivalAt
                                  )
                                )}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(
                                  new Date(
                                    data.departureAirport_start_journey.arrivalAt
                                  )
                                )}
                              </h3>
                              <h3>
                                Duration:{" "}
                                {
                                  data.departureAirport_start_journey.flightTime
                                    .hours
                                }{" "}
                                Hours{" "}
                                {
                                  data.departureAirport_start_journey.flightTime
                                    .minutes
                                }{" "}
                                min
                              </h3>
                              <h3>
                                Layover: {data.layover.hours} Hours{" "}
                                {data.layover.minutes} min
                              </h3>
                              <p>
                                Available seats:{" "}
                                {data.departureAirport_start_journey
                                  .availableSeats -
                                  Number(selectedAdultOption) -
                                  Number(selectedChildOption)}
                              </p>
                              <div className="flex flex-row">
                                <p>
                                  Adult:{" "}
                                  {
                                    data.departureAirport_start_journey.prices
                                      .currency
                                  }{" "}
                                  {
                                    data.departureAirport_start_journey.prices
                                      .adult
                                  }
                                </p>
                                <select
                                  className="py-1 px-1 ml-1 rounded-full shadow-inner text-indigo-900"
                                  value={selectedAdultOption}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                  ) => setSelectedAdultOption(e.target.value)}
                                >
                                  {seats(
                                    data.departureAirport_start_journey
                                      .availableSeats
                                  ).map((seats) => (
                                    <option value={seats}>{seats}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-row">
                                <p>
                                  Child:{" "}
                                  {
                                    data.departureAirport_start_journey.prices
                                      .currency
                                  }{" "}
                                  {
                                    data.departureAirport_start_journey.prices
                                      .child
                                  }
                                </p>
                                <select
                                                                    className="py-1 px-1 ml-1 rounded-full shadow-inner text-indigo-900"

                                  value={selectedChildOption}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                  ) => setSelectedChildOption(e.target.value)}
                                >
                                  {seats(
                                    data.departureAirport_start_journey
                                      .availableSeats
                                  ).map((seats) => (
                                    <option value={seats}>{seats}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="p-4 w-full">
                            <div className="flex flex-row items-center border-b-2 pb-2 justify-start mb-2">
                              <h2 className="px-4 text-indigo-900">{flights.intermediateDestination}</h2>
                              <FaPlaneArrival className="text-indigo-900"/>
                            <h2 className="px-4 text-indigo-900">
                              {flights.arrivalDestination}
                            </h2>
                            </div>
                              <h3>
                                Flight id:{" "}
                                {
                                  data.connectingAirport_connecting_journey
                                    .flight_id
                                }
                              </h3>
                              <h3>
                                Departure:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(
                                  new Date(
                                    data.connectingAirport_connecting_journey.departureAt
                                  )
                                )}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(
                                  new Date(
                                    data.connectingAirport_connecting_journey.departureAt
                                  )
                                )}
                              </h3>
                              <h3>
                                Arrival:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(
                                  new Date(
                                    data.connectingAirport_connecting_journey.arrivalAt
                                  )
                                )}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(
                                  new Date(
                                    data.connectingAirport_connecting_journey.arrivalAt
                                  )
                                )}
                              </h3>
                              <h3>
                                Duration:{" "}
                                {
                                  data.connectingAirport_connecting_journey
                                    .flightTime.hours
                                }{" "}
                                Hours{" "}
                                {
                                  data.connectingAirport_connecting_journey
                                    .flightTime.minutes
                                }{" "}
                                min
                              </h3>
                              <h3>
                                Layover: {data.layover.hours} Hours{" "}
                                {data.layover.minutes} min
                              </h3>
                              <p>
                                Available seats:{" "}
                                {data.connectingAirport_connecting_journey
                                  .availableSeats -
                                  Number(selectedAdultConnectingOption) -
                                  Number(selectedChildConnectingOption)}
                              </p>
                              <div className="flex flex-row">
                                <p>
                                  Adult:{" "}
                                  {
                                    data.connectingAirport_connecting_journey
                                      .prices.currency
                                  }{" "}
                                  {
                                    data.connectingAirport_connecting_journey
                                      .prices.adult
                                  }
                                </p>
                                <select
                                                                    className="py-1 px-1 ml-1 rounded-full shadow-inner text-indigo-900"

                                  value={selectedAdultConnectingOption}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                  ) =>
                                    setSelectedAdultConnectingOption(
                                      e.target.value
                                    )
                                  }
                                >
                                  {seats(
                                    data.connectingAirport_connecting_journey
                                      .availableSeats
                                  ).map((seats) => (
                                    <option value={seats}>{seats}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-row">
                                <p>
                                  Child:{" "}
                                  {
                                    data.connectingAirport_connecting_journey
                                      .prices.currency
                                  }{" "}
                                  {
                                    data.connectingAirport_connecting_journey
                                      .prices.child
                                  }
                                </p>
                                <select
                                                                    className="py-1 px-1 ml-1 rounded-full shadow-inner text-indigo-900"

                                  value={selectedChildConnectingOption}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                  ) =>
                                    setSelectedChildConnectingOption(
                                      e.target.value
                                    )
                                  }
                                >
                                  {seats(
                                    data.connectingAirport_connecting_journey
                                      .availableSeats
                                  ).map((seats) => (
                                    <option value={seats}>{seats}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              bookFlight(
                                data,
                                selectedChildOption,
                                selectedAdultOption,
                                selectedChildConnectingOption,
                                selectedAdultConnectingOption,
                                token,
                                setSelectedChildOption,
                                setAddedToCart,
                                addedToCart,
                                setSelectedChildConnectingOption,
                                setSelectedAdultConnectingOption,
                                setSelectedAdultOption,
                                selectedChildDirectOption,
                                selectedAdultDirectOption,
                                setSelectedAdultDirectOption,
                                setSelectedChildDirectOption,
                                checkbox,
                                setAllFlights,
                                searchReturnFlight,
                                returnStartDate,
                                returnEndDate,
                                departureAt,
                                arrivalAt,
                                showToastMessage
                              )
                            }
                            className="self-end border-solid border rounded-full bg-white text-indigo-200 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"
                          >
                            Add to Cart
                          </button>
                        </article>
                      ) : (
                        <article className="flex flex-col border rounded-lg bg-indigo-200 py-5 px-5 mb-3">
                          <div className="flex flex-row justify-evenly divide-x-2">
                            <div className="w-1/2 p-3 ">
                              <h3>Flight id: {data.flight_id}</h3>
                              <h3>
                                Departure:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(new Date(data.departureAt))}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(new Date(data.departureAt))}
                              </h3>
                              <h3>
                                Arrival:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(new Date(data.arrivalAt))}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(new Date(data.arrivalAt))}
                              </h3>
                              <h3>
                                Duration:{" "}
                                {flightTime(data.departureAt, data.arrivalAt).hours}{" "}
                                Hours{" "}
                                {
                                  flightTime(data.departureAt, data.arrivalAt)
                                    .minutes
                                }{" "}
                                min
                              </h3>
                            </div>
                            <div className="w-1/2 p-3">

                          <p>
                            Available seats:{" "}
                            {data.availableSeats -
                              Number(selectedAdultDirectOption) -
                              Number(selectedChildDirectOption)}
                          </p>
                          <div className="flex flex-row">
                            <p>
                              Adult: {data.prices.currency} {data.prices.adult}
                            </p>
                            <select
                                                                className="py-1 px-1 ml-1 rounded-full shadow-inner text-indigo-900"

                              value={selectedAdultDirectOption}
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                              ) => setSelectedAdultDirectOption(e.target.value)}
                            >
                              {seats(data.availableSeats).map((seats) => (
                                <option value={seats}>{seats}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-row">
                            <p>
                              Child: {data.prices.currency} {data.prices.child}
                            </p>
                            <select
                                                                className="py-1 px-1 ml-1 rounded-full shadow-inner text-indigo-900"

                              value={selectedChildDirectOption}
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                              ) => setSelectedChildDirectOption(e.target.value)}
                            >
                              {seats(data.availableSeats).map((seats) => (
                                <option value={seats}>{seats}</option>
                              ))}
                            </select>
                          </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              bookFlight(
                                data,
                                selectedChildOption,
                                selectedAdultOption,
                                selectedChildConnectingOption,
                                selectedAdultConnectingOption,
                                token,
                                setSelectedChildOption,
                                setAddedToCart,
                                addedToCart,
                                setSelectedChildConnectingOption,
                                setSelectedAdultConnectingOption,
                                setSelectedAdultOption,
                                selectedChildDirectOption,
                                selectedAdultDirectOption,
                                setSelectedAdultDirectOption,
                                setSelectedChildDirectOption,
                                checkbox,
                                setAllFlights,
                                searchReturnFlight,
                                returnStartDate,
                                returnEndDate,
                                departureAt,
                                arrivalAt,
                                showToastMessage
                              )
                            }
                            className="self-end border-solid border rounded-full bg-white text-indigo-200 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"

                          >
                            Add to Cart
                          </button>
                        </article>
                      ))}
                  </>
                );
              })}
            </article>
          );
        })
      ) : (
        <h2>Search For a Flight</h2>
      )}
    </section>
  );
};

export default Oneway;
