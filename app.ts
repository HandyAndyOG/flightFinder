import express from "express";
import { Request, Response, Application } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { fetchData } from "./controllers/FlightData";
import { Flight } from "./Model/model";
import { Users } from "./Model/model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app: Application = express();
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("No valid token");
  }
  if (typeof accessTokenSecret === "string") {
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (err) {
        return res.status(403).send("No Access");
      }
      req.user = user;
      next();
    });
  }
};

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.cgvcn5o.mongodb.net/Flight`
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

app.get("/api/users", authenticateToken, async (_: Request, res: Response) => {
  const allUsers = await Users.find({});
  res.status(200).send(allUsers);
});
app.post("/api/user/register", async (req: Request, res: Response) => {
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  try {
    await Users.create({
      email: req.body.email,
      password: hashedPass,
      uid: uuidv4(),
      cart: [],
    })
    return res.status(200).send('New user created successfully!')
  } catch(err) {
    return res.status(400).send(`failed to create new User, ERROR: ${err}`)
  }
  
});

app.get("/api/user/cart", (_: Request, res: Response) => {
  res.status(200).send("cart here");
});

export default app;
