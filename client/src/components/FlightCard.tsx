import React, { useContext, useState } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { v4 as uuidv4 } from "uuid";

interface FlightData {
  [key: string]: boolean;
}

const FlightCard = () => {
  const { allFlights, token } = useContext(FlightContext);
  console.log(token)
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

  const bookFlight = (data: any) => {
    if (Number(selectedChildOption) > 0 || Number(selectedAdultOption) > 0) {
      const flight = {
        departureAirport_start_journey: {
          flight_id: data.departureAirport_start_journey.flight_id,
          departureAt: data.departureAirport_start_journey.departureAt,
          arrivalAt: data.departureAirport_start_journey.arrivalAt,
          seatsBooked: Number(selectedChildOption) + Number(selectedAdultOption),
          adultQuantity: selectedAdultOption,
          adultPrice: data.departureAirport_start_journey.prices.adult,
          childQuantity: selectedChildOption,
          childPrice: data.departureAirport_start_journey.prices.child,
        },
        connectingAirport_connecting_journey: {
          flight_id: data.connectingAirport_connecting_journey.flight_id,
          departureAt:
            data.connectingAirport_connecting_journey.departureAt,
          arrivalAt: data.connectingAirport_connecting_journey.arrivalAt,
          seatsBooked: Number(selectedChildConnectingOption) + Number(selectedAdultConnectingOption),
          adultQuantity: selectedAdultOption,
          adultPrice:
            data.connectingAirport_connecting_journey.prices.adult,
          childQuantity: selectedChildOption,
          childPrice:
            data.connectingAirport_connecting_journey.prices.child,
        },
      };
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(flight)
    };
      fetch("http://localhost:8080/api/user/cart", requestOptions)
      .then((response) => response.json())
      .then((data) => { console.log(data)})
      .catch((err) => console.log(err))
      .finally(() => {
        setSelectedChildOption('')
        setSelectedChildConnectingOption('')
        setSelectedAdultConnectingOption('')
        setSelectedAdultOption('')
      });
    } else if (
      Number(selectedChildDirectOption) > 0 ||
      Number(selectedAdultDirectOption) > 0
    ) {
      const flight = {
        flight_id: data.flight_id,
        departureAt: data.departureAt,
        arrivalAt: data.arrivalAt,
        seatsBooked:
          Number(selectedAdultDirectOption) + Number(selectedChildDirectOption),
        adultQuantity: Number(selectedAdultDirectOption),
        adultPrice: data.prices.adult,
        childQuantity: Number(selectedChildDirectOption),
        childPrice: data.prices.child,
      };
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
  
      const requestOptions = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(flight)
      };
        fetch("http://localhost:8080/api/user/cart", requestOptions)
        .then((response) => response.json())
        .then((data) => { console.log(data)})
        .catch((err) => console.log(err))
        .finally(() => {
          setSelectedAdultDirectOption('')
          setSelectedChildDirectOption('')
        });

    }
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
                                    data.departureAirport_start_journey.prices
                                      .currency
                                  }{" "}
                                  {
                                    data.departureAirport_start_journey.prices
                                      .child
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
                                    data.connectingAirport_connecting_journey
                                      .prices.currency
                                  }{" "}
                                  {
                                    data.connectingAirport_connecting_journey
                                      .prices.child
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
                            onClick={() => bookFlight(data)}
                            className="border rounded px-2 py-1 w-25 self-center mt-2"
                          >
                            Add to Cart
                          </button>
                        </article>
                      ) : (
                        <article className="flex flex-col border rounded py-3 px-3 mb-3">
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
                            onClick={() => bookFlight(data)}
                            className="border rounded px-2 py-1 w-25 self-end mt-2"
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

export default FlightCard;
