import React, { useContext, useState } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { v4 as uuidv4 } from "uuid";

interface FlightData {
  [key: string]: boolean;
}

const FlightCard = () => {
  const { allFlights } = useContext(FlightContext);
  const [clicked, setClicked] = useState<FlightData>({});
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [childCheckbox, setChildCheckbox] = useState<boolean>(false);
  const [selectedChildOption, setSelectedChildOption] = useState('');
  const [selectedAdultOption, setSelectedAdultOption] = useState('');

  const bookFlight = () => {
    console.log(selectedChildOption, 'child')
    console.log(selectedAdultOption, 'adult')
}

  const seeFlight = (data: any) => {
    const flightId = data._id;
    setClicked((prevState) => ({
      ...prevState,
      [flightId]: !prevState[flightId],
    }));
  };
  const seats = (num: number) => Array.from({ length: num }, (_, i) => i );

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
                              {data.connectingAirport_connecting_journey.prices
                                .adult +
                                data.departureAirport_start_journey.prices
                                  .adult}
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
                        <div>
                          <h2>
                            {flights.departureDestination} to{" "}
                            {flights.arrivalDestination}
                          </h2>
                          <p>
                            Estimated Price: ~{data.prices.currency}
                            {data.prices.adult}
                          </p>
                        </div>
                      )}
                    </article>
                    {clicked[data._id] &&
                      (data.connectingAirport_connecting_journey ? (
                        <article className="border rounded py-3 px-3 mb-3 grid grid-cols-2 divide-x-2">
                          <div className="p-4 w-full flex flex-col items-end">
                            <h2>
                              {flights.departureDestination}
                              {" => "}
                              {flights.intermediateDestination}
                            </h2>
                            <h3>
                              Layover: {data.layover.hours} Hours{" "}
                              {data.layover.minutes} min
                            </h3>
                            <p>
                              Available seats:{" "}
                              {
                                data.connectingAirport_connecting_journey
                                  .availableSeats
                              }
                            </p>
                            <div className="flex flex-row">
                              <input
                                type="checkbox"
                                checked={checkbox}
                                className="mr-3"
                                onChange={() => setCheckbox(!checkbox)}
                              />
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
                              {checkbox ? (
                                <select className="border ml-1" value={selectedAdultOption}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => setSelectedAdultOption(e.target.value)}>
                                  {seats(
                                    data.connectingAirport_connecting_journey
                                      .availableSeats
                                  ).map((seats) => (
                                    <option value={seats}>{seats}</option>
                                  ))}
                                </select>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="flex flex-row">
                              <input
                                type="checkbox"
                                checked={childCheckbox}
                                className="mr-3"
                                onChange={() =>
                                  setChildCheckbox(!childCheckbox)
                                }
                              />
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
                              {childCheckbox ? (
                                <select
                                  className="border ml-1"
                                  value={selectedChildOption}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                  ) => setSelectedChildOption(e.target.value)}
                                >
                                  {seats(
                                    data.connectingAirport_connecting_journey
                                      .availableSeats
                                  ).map((seats) => (
                                    <option value={seats}>{seats}</option>
                                  ))}
                                </select>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="p-4 w-full">
                            <h2>
                              {flights.intermediateDestination}
                              {" => "}
                              {flights.arrivalDestination}
                            </h2>
                            <h3>
                              Layover: {data.layover.hours} Hours{" "}
                              {data.layover.minutes} min
                            </h3>
                            <p>
                              Available seats:{" "}
                              {
                                data.departureAirport_start_journey
                                  .availableSeats
                              }
                            </p>
                            <p>
                              Adult:{" "}
                              {
                                data.departureAirport_start_journey.prices
                                  .currency
                              }{" "}
                              {data.departureAirport_start_journey.prices.adult}
                            </p>
                            <p>
                              Child:{" "}
                              {
                                data.departureAirport_start_journey.prices
                                  .currency
                              }{" "}
                              {data.departureAirport_start_journey.prices.child}
                            </p>
                          </div>
                          <button onClick={bookFlight} className='border rounded px-2 py-1 w-1/2'>Book</button>
                        </article>
                      ) : (
                        <article className="border rounded py-3 px-3 mb-3">
                          <h3>Flight id: {data.flight_id}</h3>
                          <p>Available seats: {data.availableSeats}</p>
                          <p>
                            Adult: {data.prices.currency} {data.prices.adult}
                          </p>
                          <p>
                            Child: {data.prices.currency} {data.prices.child}
                          </p>
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
