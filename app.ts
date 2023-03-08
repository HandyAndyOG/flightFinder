import express from "express";
import { Request, Response, Application } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { fetchData } from "./controllers/FlightData";
import { Flight } from "./Model/model";

dotenv.config();
const app: Application = express();
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.cgvcn5o.mongodb.net/Flight"
);

app.use(function (_, res: Response, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const flightChecker = async (
  departureAirport: string,
  arrivalAirport: string
) => {
  const onlyCorrectDepart = await Flight.find({
    departureDestination: departureAirport,
    arrivalDestination: { $ne: arrivalAirport },
  });
  const connectingDeparts = onlyCorrectDepart.map((flight) => ({
    departureDestination: flight.arrivalDestination,
  }));

  const onlyCorrectArrival = await Flight.find({
    arrivalDestination: arrivalAirport,
    $or: connectingDeparts,
  });
  const connectingArrival = onlyCorrectArrival.map((flight) => ({
    arrivalDestination: flight.departureDestination,
  }));
  const combinedFlights = await Flight.find({
    $or: [
      {
        departureDestination: departureAirport,
        arrivalDestination: arrivalAirport,
      },
      { arrivalDestination: arrivalAirport, $or: connectingDeparts },
      { departureDestination: departureAirport, $or: connectingArrival },
    ],
  });
  return combinedFlights;
};

// const flightTime = (departTime: string, arrivalTime: string) => {
//   const startTime: Date = new Date(departTime);
//   const endTime: Date = new Date(arrivalTime);
//   const diffMilliseconds: number = endTime.getTime() - startTime.getTime();
//   const diffMinutes: number = diffMilliseconds / 60000;
//   const diffHours: number = Math.floor(diffMinutes / 60);
//   const remainingMinutes: number = Math.round(diffMinutes % 60);
//   return { flightHours: diffHours, flightMinutes: remainingMinutes };
// };

app.get("/api", async (_: Request, res: Response) => {
  const allFlights = await fetchData();
  res.status(200).send(allFlights);
});

app.get("/api/flights", async (req: Request, res: Response) => {
  const departureAirport = req.body.departureAt;
  const arrivalAirport = req.body.arrivalAt;
  if (departureAirport && arrivalAirport) {
    const filteredFlights = await flightChecker(
      departureAirport,
      arrivalAirport
    );
    res.status(200).send(filteredFlights);
  }
});

app.get("/api/flights/selectedTimes", async (req: Request, res: Response) => {
  const flightSpecifications = req.body;
  if (Object.keys(flightSpecifications).length === 4) {
    const filteredFlights = await flightChecker(
      flightSpecifications.departureAt,
      flightSpecifications.arrivalAt
    );
    // flightTime(
    //   flightSpecifications.departureTime,
    //   flightSpecifications.arrivalTime
    // );

    const departureTime = new Date(flightSpecifications.departureTime);
    const arrivalTime = new Date(flightSpecifications.arrivalTime);
    const flightsAtTime = filteredFlights
      .map((flight) => {
        const matchingItineraries = flight?.itineraries.filter((data) => {
          if (data.departureAt && data.arrivalAt) {
            return (
              departureTime.getTime() <= new Date(data.departureAt).getTime() &&
              arrivalTime.getTime() >= new Date(data.arrivalAt).getTime() &&
              new Date(data.departureAt).getTime() < arrivalTime.getTime()
            );
          }
          return false;
        });
        return matchingItineraries?.length
          ? { ...flight.toObject(), itineraries: matchingItineraries }
          : null;
      })
      .filter(Boolean);
    console.log(flightsAtTime);
    return res.status(200).send(flightsAtTime);
  }
  return res.status(400).send("too many or too little objects sent");
});

export default app;
