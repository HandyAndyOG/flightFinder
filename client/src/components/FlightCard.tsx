import React, { useContext } from "react";
import { FlightContext } from "../stateManagement/FlightContext";
import { v4 as uuidv4 } from "uuid";

const FlightCard = () => {
  const { allFlights } = useContext(FlightContext);
  return (
    <section>
      {allFlights ? (
        allFlights.map((flights) => {
          return (
            <article key={uuidv4()}>
              {flights.itineraries.map((data) => {
                return (
                  <article key={uuidv4()}>
                    {data.connectingAirport_connecting_journey &&
                    data.departureAirport_start_journey ? (
                      <>
                        <div>
                          <h2>
                            {flights.departureDestination} to{" "}
                            {flights.intermediateDestination}
                          </h2>
                          <p>
                            {" "}
                            {
                              data.connectingAirport_connecting_journey
                                .flight_id
                            }
                          </p>
                          <p>
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
                          </p>
                          <p>Estimated price: ~{data.connectingAirport_connecting_journey.prices.currency}{data.connectingAirport_connecting_journey.prices.adult + data.departureAirport_start_journey.prices.adult}</p>
                        </div>
                        <div>
                          <h3>
                            Layover {data.layover.hours} Hours{" "}
                            {data.layover.minutes} min
                          </h3>
                        </div>
                        <div>
                          <h2>
                            {flights.intermediateDestination} to{" "}
                            {flights.arrivalDestination}
                          </h2>
                          <p>{data.departureAirport_start_journey.flight_id}</p>
                          <p>
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
                          </p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h2>
                          {flights.departureDestination} to
                          {flights.arrivalDestination}
                        </h2>
                        <p>{data.flight_id}</p>
                        <p>Estimated Price: ~{data.prices.currency}{data.prices.adult}</p>
                      </div>
                    )}
                  </article>
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
