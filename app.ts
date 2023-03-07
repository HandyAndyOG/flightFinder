import express from "express";
import { Request, Response, Application } from "express";
import * as dotenv from "dotenv";
import { tempData } from "./tempData";

dotenv.config();
const app: Application = express();
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(function (_, res: Response, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const flightChecker = (departureAt: string, arrivalAt: string) => {
  let allFlights = [];
  const directFlight = tempData.filter(
    (data) =>
      data.departureDestination === departureAt &&
      data.arrivalDestination === arrivalAt
  );
  const connectingFlightCorrectArrival = tempData.filter(
    (data) =>
      data.arrivalDestination === arrivalAt &&
      data.departureDestination !== departureAt
  );
  const alternativeDeparture = connectingFlightCorrectArrival.map((flight) => {
    if (flight.departureDestination !== departureAt) {
      return flight.departureDestination;
    }
    return;
  });
  const connectingFlightAlternativeDeparture = tempData.filter((flight) => {
    return alternativeDeparture.some(
      (departureAirport) =>
        departureAirport === flight.arrivalDestination &&
        flight.departureDestination === departureAt
    );
  });
  if (
    directFlight &&
    connectingFlightAlternativeDeparture &&
    connectingFlightCorrectArrival
  ) {
    allFlights.push(directFlight[0]);
    allFlights.push(connectingFlightCorrectArrival[0]);
    allFlights.push(connectingFlightAlternativeDeparture[0]);
    return allFlights;
  }
  return directFlight;
};

const flightTime = (departTime: string, arrivalTime: string) => {
  const startTime: Date = new Date(departTime);
  const endTime: Date = new Date(arrivalTime);
  const diffMilliseconds: number = endTime.getTime() - startTime.getTime();
  const diffMinutes: number = diffMilliseconds / 60000;
  const diffHours: number = Math.floor(diffMinutes / 60);
  const remainingMinutes: number = Math.round(diffMinutes % 60);
  return { flightHours: diffHours, flightMinutes: remainingMinutes };
};

app.get("/api", (_: Request, res: Response) => {
  res.status(200).send(tempData);
});

app.get("/api/flights", (req: Request, res: Response) => {
  const departureAt = req.body.departureAt;
  const arrivalAt = req.body.arrivalAt;
  if (departureAt && arrivalAt) {
    const flights = flightChecker(departureAt, arrivalAt);
    res.status(200).send(flights);
  }
});

app.get("/api/flights/selectedTimes", (req: Request, res: Response) => {
  const flightSpecifications = req.body;
  if (Object.keys(flightSpecifications).length === 4) {
    flightTime(
      flightSpecifications.departureTime,
      flightSpecifications.arrivalTime
    );
    const flights = flightChecker(
      flightSpecifications.departureAirport,
      flightSpecifications.arrivalAirport
    );
    const copyFlights = [...flights];
    const departureTime = new Date(flightSpecifications.departureTime);
    const arrivalTime = new Date(flightSpecifications.arrivalTime);
    const flightsAtTime = copyFlights
      .map((flight) => {
        const matchingItineraries = flight?.itineraries.filter(
          (data) =>
            departureTime.getTime() <= new Date(data.departureAt).getTime() &&
            arrivalTime.getTime() >= new Date(data.arrivalAt).getTime() &&
            new Date(data.departureAt).getTime() < arrivalTime.getTime()
        );
        return matchingItineraries?.length
          ? { ...flight, itineraries: matchingItineraries }
          : null;
      })
      .filter(Boolean);
    return res.status(200).send(flightsAtTime);
  }
  return res.status(400).send("too many or too little objects sent");
});

export default app;
