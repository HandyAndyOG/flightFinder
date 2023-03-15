import React, { useContext, useState } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { v4 as uuidv4 } from "uuid";

interface FlightData {
  [key: string]: boolean;
}

const FlightCard = () => {
  const { allFlights } = useContext(FlightContext);
  const [clicked, setClicked] = useState<FlightData>({});
  const [selectedChildOption, setSelectedChildOption] = useState("");
  const [selectedAdultDirectOption, setSelectedAdultDirectOption] =
    useState("");
  const [selectedChildDirectOption, setSelectedChildDirectOption] =
    useState("");
  const [selectedChildConnectingOption, setSelectedChildConnectingOption] =
    useState("");
  const [selectedAdultOption, setSelectedAdultOption] = useState("");
  const [selectedAdultConnectingOption, setSelectedAdultConnectingOption] =
    useState("");


const flightTime = (departTime: string, arrivalTime: string) => {
  const startTime: Date = new Date(departTime);
  const endTime: Date = new Date(arrivalTime);
  const diffMilliseconds: number = endTime.getTime() - startTime.getTime();
  const diffMinutes: number = diffMilliseconds / 60000;
  const diffHours: number = Math.floor(diffMinutes / 60);
  const remainingMinutes: number = Math.round(diffMinutes % 60);
  return { hours: diffHours, minutes: remainingMinutes };
};

  const bookFlight = () => {
    console.log(selectedChildOption, "child");
    console.log(selectedAdultOption, "adult");
    console.log(selectedChildConnectingOption, "connecting child");
    console.log(selectedAdultConnectingOption, "connecting adult");
  };

  const seeFlight = (data: any) => {
    const flightId = data._id;
    setClicked((prevState) => ({
      ...prevState,
      [flightId]: !prevState[flightId],
    }));
  };
  const seats = (num: number) => {
    return Array.from({ length: num + 1 }, (_, i) => i);
  };

  return (
    <section className="flex items-center flex-col">
      {allFlights ? (
        allFlights.map((flights) => {
          return (
            <article key={uuidv4()} className=" w-4/5">
              {flights.itineraries.map((data) => {
                return (
                  <>
                    <article
                      key={uuidv4()}
                      className=" p-3 border rounded mb-1"
                      onClick={() => seeFlight(data)}
                    >
                      {data.connectingAirport_connecting_journey &&
                      data.departureAirport_start_journey ? (
                        <>
                          <div>
                            <h2 className="">
                              {flights.departureDestination} to{" "}
                              {flights.intermediateDestination}
                            </h2>
                            <p>
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
                            <h2>
                              {flights.intermediateDestination} to{" "}
                              {flights.arrivalDestination}
                            </h2>
                          </div>
                        </>
                      ) : (
                        <article key={uuidv4()}>
                          <h2>
                            {flights.departureDestination} to{" "}
                            {flights.arrivalDestination}
                          </h2>
                          <p>
                            Estimated Price: ~{data.prices.currency}
                            {Math.round(data.prices.adult)}
                          </p>
                        </article>
                      )}
                    </article>
                    {clicked[data._id] &&
                      (data.connectingAirport_connecting_journey ? (
                        <article className="flex flex-col border rounded py-3 px-3 mb-3">
                          <div className=" grid grid-cols-2 divide-x-2">
                            <div className="p-4 w-full flex flex-col items-end">
                              <h2>
                                {flights.departureDestination}
                                {" => "}
                                {flights.intermediateDestination}
                              </h2>
                              <h3>Flight id: {data.departureAirport_start_journey.flight_id}</h3>
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
                                  data.departureAirport_start_journey
                                    .flightTime.hours
                                }{" "}
                                Hours{" "}
                                {
                                  data.departureAirport_start_journey
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
                                {data.departureAirport_start_journey
                                  .availableSeats -
                                  Number(selectedAdultOption) -
                                  Number(selectedChildOption)}
                              </p>
                              <div className="flex flex-row">
                                <p>
                                  Adult:{" "}
                                  {
                                    data.departureAirport_start_journey
                                      .prices.currency
                                  }{" "}
                                  {
                                    data.departureAirport_start_journey
                                      .prices.adult
                                  }
                                </p>
                                <select
                                  className="border ml-1"
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
                                    data.departureAirport_start_journey
                                      .prices.currency
                                  }{" "}
                                  {
                                    data.departureAirport_start_journey
                                      .prices.child
                                  }
                                </p>
                                <select
                                  className="border ml-1"
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
                              <h2>
                                {flights.intermediateDestination}
                                {" => "}
                                {flights.arrivalDestination}
                              </h2>
                              <h3>Flight id: {data.connectingAirport_connecting_journey.flight_id}</h3>
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
                                  data.connectingAirport_connecting_journey.flightTime
                                    .hours
                                }{" "}
                                Hours{" "}
                                {
                                  data.connectingAirport_connecting_journey.flightTime
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
                                {data.connectingAirport_connecting_journey
                                  .availableSeats -
                                  Number(selectedAdultConnectingOption) -
                                  Number(selectedChildConnectingOption)}
                              </p>
                              <div className="flex flex-row">
                                <p>
                                  Adult:{" "}
                                  {
                                    data.connectingAirport_connecting_journey.prices
                                      .currency
                                  }{" "}
                                  {
                                    data.connectingAirport_connecting_journey.prices
                                      .adult
                                  }
                                </p>
                                <select
                                  className="border ml-1"
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
                                    data.connectingAirport_connecting_journey.prices
                                      .currency
                                  }{" "}
                                  {
                                    data.connectingAirport_connecting_journey.prices
                                      .child
                                  }
                                </p>
                                <select
                                  className="border ml-1"
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
                            onClick={bookFlight}
                            className="border rounded px-2 py-1 w-20 self-center mt-2"
                          >
                            Book
                          </button>
                        </article>
                      ) : (
                        <article className="flex flex-col border rounded py-3 px-3 mb-3">
                          <h3>Flight id: {data.flight_id}</h3>
                          <h3>
                                Departure:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(
                                  new Date(
                                    data.departureAt
                                  )
                                )}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(
                                  new Date(
                                    data.departureAt
                                  )
                                )}
                              </h3>
                              <h3>
                                Arrival:{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  dateStyle: "long",
                                }).format(
                                  new Date(
                                    data.arrivalAt
                                  )
                                )}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                  timeStyle: "long",
                                }).format(
                                  new Date(
                                    data.arrivalAt
                                  )
                                )}
                              </h3>
                              <h3>
                                Duration:{" "}
                                {
                                  flightTime(data.departureAt, data.arrivalAt).hours
                                }{" "}
                                Hours{" "}
                                {
                                  flightTime(data.departureAt, data.arrivalAt).minutes
                                }{" "}
                                min
                              </h3>
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
                              className="border ml-1"
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
                              className="border ml-1"
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
                          <button
                            onClick={bookFlight}
                            className="border rounded px-2 py-1 w-20 self-end mt-2"
                          >
                            Book
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

export default FlightCard;
