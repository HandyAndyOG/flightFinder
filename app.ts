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

  const connectingFlights = onlyCorrectDepart.filter(
    (data) =>
      data.arrivalDestination === connectingArrival[0]?.arrivalDestination
  );
  const combinedConnectingFlights = connectingFlights.flatMap(
    (departureData) => {
      return onlyCorrectArrival.flatMap((arrivalData) => {
        return {
          route_id: `${departureData.route_id}${arrivalData.route_id}`,
          departureDestination: departureData.departureDestination,
          intermediateDestination: arrivalData.departureDestination,
          arrivalDestination: arrivalData.arrivalDestination,
          itineraries: departureData.itineraries.flatMap((departureIt) => {
            return arrivalData.itineraries.flatMap((arrivalIt) => {
              return {
                departureAirport_start_journey: {
                  flight_id: departureIt.flight_id,
                  departureAt: departureIt.departureAt,
                  arrivalAt: departureIt.arrivalAt,
                  flightTime:
                    departureIt.departureAt && departureIt.arrivalAt
                      ? flightTime(
                          departureIt.departureAt,
                          departureIt.arrivalAt
                        )
                      : 0,
                  availableSeats: departureIt.availableSeats,
                  prices: {
                    currency: departureIt?.prices?.currency,
                    adult: departureIt?.prices?.adult,
                    child: departureIt?.prices?.child,
                  },
                },
                layover:
                  departureIt.arrivalAt && arrivalIt.departureAt
                    ? flightTime(departureIt.arrivalAt, arrivalIt.departureAt)
                    : null,
                connectingAirport_connecting_journey: {
                  flight_id: arrivalIt.flight_id,
                  departureAt: arrivalIt.departureAt,
                  arrivalAt: arrivalIt.arrivalAt,
                  flightTime:
                    arrivalIt.departureAt && arrivalIt.arrivalAt
                      ? flightTime(arrivalIt.departureAt, arrivalIt.arrivalAt)
                      : 0,
                  availableSeats: arrivalIt.availableSeats,
                  prices: {
                    currency: arrivalIt?.prices?.currency,
                    adult: arrivalIt?.prices?.adult,
                    child: arrivalIt?.prices?.child,
                  },
                },
              };
            });
          }),
        };
      });
    }
  );
  return combinedConnectingFlights;
};

const flightTime = (departTime: string, arrivalTime: string) => {
  const startTime: Date = new Date(departTime);
  const endTime: Date = new Date(arrivalTime);
  const diffMilliseconds: number = endTime.getTime() - startTime.getTime();
  const diffMinutes: number = diffMilliseconds / 60000;
  const diffHours: number = Math.floor(diffMinutes / 60);
  const remainingMinutes: number = Math.round(diffMinutes % 60);
  return { hours: diffHours, minutes: remainingMinutes };
};

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
  const departureTime = new Date(flightSpecifications.departureTime);
  const arrivalTime = new Date(flightSpecifications.arrivalTime);

  if (Object.keys(flightSpecifications).length === 4) {
    const connectingFlightsRaw = await flightChecker(
      flightSpecifications.departureAt,
      flightSpecifications.arrivalAt
    );

    const connectingFlightsNoNegativeLayovers = connectingFlightsRaw
      .map((data) => {
        const matchingLayovers = data.itineraries.filter((flights) => {
          return flights?.layover?.hours ? flights?.layover?.hours > 0 : "";
        });
        return matchingLayovers?.length
          ? { ...data, itineraries: matchingLayovers }
          : null;
      })
      .filter(Boolean);

    const connectingFlightsAtTime = connectingFlightsNoNegativeLayovers
      .map((flight) => {
        const matchingItineraries = flight?.itineraries.filter((data) => {
          if (
            data.departureAirport_start_journey.departureAt &&
            data.connectingAirport_connecting_journey.arrivalAt
          ) {
            return (
              departureTime.getTime() <=
                new Date(
                  data.departureAirport_start_journey.departureAt
                ).getTime() &&
              arrivalTime.getTime() >=
                new Date(
                  data.connectingAirport_connecting_journey.arrivalAt
                ).getTime() &&
              new Date(
                data.departureAirport_start_journey.departureAt
              ).getTime() < arrivalTime.getTime()
            );
          }
          return false;
        });
        return matchingItineraries?.length
          ? { ...flight, itineraries: matchingItineraries }
          : null;
      })
      .filter(Boolean);

    const directFlight = await Flight.find({
      departureDestination: flightSpecifications.departureAt,
      arrivalDestination: flightSpecifications.arrivalAt,
    });
    const directFlightsAtTime = directFlight
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

    const allFlights = [...directFlightsAtTime, ...connectingFlightsAtTime];
    return res.status(200).send(allFlights);
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
    });
    return res.status(200).send("New user created successfully!");
  } catch (err) {
    return res.status(400).send(`failed to create new User, ERROR: ${err}`);
  }
});

app.post("/api/user/login/", async (req: Request, res: Response) => {
  const verifyUser = await Users.find({ email: req.body.email });
  verifyUser.find(async (user) => {
    if (user.password) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        if (typeof accessTokenSecret === "string") {
          const userDetails = {
            email: user.email,
            uid: user.uid,
            cart: user.cart,
          };
          const accessToken = jwt.sign(userDetails, accessTokenSecret);
          return res
            .status(200)
            .send({ status: "Login Successful", accessToken: accessToken });
        }
        return res.status(500).send("Internal Server Error");
      }
      return res.status(404).send("Invalid Password");
    }
    return res.status(500).send("Internal Server Error");
  });
});

app.get(
  "/api/user/cart",
  authenticateToken,
  async (req: any, res: Response) => {
    const userProfile = await Users.find({ uid: req.user.uid });
    const userCart = {
      email: userProfile[0]?.email,
      cart: userProfile[0]?.cart,
    };
    res.status(200).send(userCart);
  }
);

app.post(
  "/api/user/cart",
  authenticateToken,
  async (req: any, res: Response) => {
    if (req.body.hasOwnProperty("departureAirport_start_journey")) {
      const addToCart = {
        connectingFlight: {
          departureAirport_start_journey: {
            flight_id: req.body.departureAirport_start_journey.flight_id,
            departureAt: req.body.departureAirport_start_journey.departureAt,
            arrivalAt: req.body.departureAirport_start_journey.arrivalAt,
            seatsBooked: req.body.departureAirport_start_journey.seatsBooked,
            tickets: {
              adultQuantity:
                req.body.departureAirport_start_journey.adultQuantity,
              adultPrice: req.body.departureAirport_start_journey.adultPrice,
              childQuantity:
                req.body.departureAirport_start_journey.childQuantity,
              childPrice: req.body.departureAirport_start_journey.childPrice,
            },
          },
          connectingAirport_connecting_journey: {
            flight_id: req.body.connectingAirport_connecting_journey.flight_id,
            departureAt:
              req.body.connectingAirport_connecting_journey.departureAt,
            arrivalAt: req.body.connectingAirport_connecting_journey.arrivalAt,
            seatsBooked:
              req.body.connectingAirport_connecting_journey.seatsBooked,
            tickets: {
              adultQuantity:
                req.body.connectingAirport_connecting_journey.adultQuantity,
              adultPrice:
                req.body.connectingAirport_connecting_journey.adultPrice,
              childQuantity:
                req.body.connectingAirport_connecting_journey.childQuantity,
              childPrice:
                req.body.connectingAirport_connecting_journey.childPrice,
            },
          },
        },
      };
      const filter = { uid: req.user.uid };
      const update = {
        $push: {
          cart: addToCart,
        },
      };
      await Users.updateOne(filter, update);
      return res.status(200).send("Flight added to cart successfully!");
    } else {
      try {
        const addToCart = {
          directFlight: {
            flight_id: req.body.flight_id,
            departureAt: req.body.departureAt,
            arrivalAt: req.body.arrivalAt,
            seatsBooked: req.body.seatsBooked,
            tickets: {
              adultQuantity: req.body.adultQuantity,
              adultPrice: req.body.adultPrice,
              childQuantity: req.body.childQuantity,
              childPrice: req.body.childPrice,
            },
          },
        };
        const filter = { uid: req.user.uid };
        const update = {
          $push: {
            cart: addToCart,
          },
        };
        await Users.updateOne(filter, update);
        return res.status(200).send("Flight added to cart successfully!");
      } catch (err) {
        return res.status(400).send(err);
      }
    }
  }
);
app.post(
  "/api/user/cart/checkout",
  authenticateToken,
  async (req: any, res: Response) => {
    const userProfile = await Users.find({ uid: req.user.uid });
    const cart = userProfile[0]?.cart || [];
    if (req.body.directFlight) {
      const ticketQuantity = cart.find(
        (flights) =>
          flights.directFlight?.flight_id === req.body.directFlight.flight_id
      );
      if (ticketQuantity?.directFlight?.seatsBooked) {
        await Flight.findOne(
          { "itineraries.flight_id": req.body.directFlight.flight_id },
          { "itineraries.$": 1 }
        );
        await Flight.updateOne(
          { "itineraries.flight_id": req.body.directFlight.flight_id },
          {
            $inc: {
              "itineraries.$.availableSeats":
                -ticketQuantity?.directFlight?.seatsBooked,
            },
          }
        );
        return res.status(200).send("Available seats have been updated");
      }
      return res.status(404).send("No seats booked");
    } else if (req.body.connectingFlight) {
      const ticketQuantity = cart.find(
        (flights) =>
          flights.connectingFlight?.departureAirport_start_journey
            ?.flight_id ===
            req.body.connectingFlight?.departureAirport_start_journey
              ?.flight_id &&
          flights.connectingFlight?.connectingAirport_connecting_journey
            ?.flight_id ===
            req.body.connectingFlight?.connectingAirport_connecting_journey
              ?.flight_id
      );
      if (ticketQuantity?.connectingFlight?.departureAirport_start_journey?.seatsBooked && ticketQuantity?.connectingFlight?.connectingAirport_connecting_journey?.seatsBooked) {
        await Flight.findOne(
          { "itineraries.flight_id": req.body.connectingFlight?.departureAirport_start_journey?.flight_id },
          { "itineraries.$": 1 }
        );
        await Flight.updateOne(
          { "itineraries.flight_id": req.body.connectingFlight?.departureAirport_start_journey?.flight_id },
          {
            $inc: {
              "itineraries.$.availableSeats":
                -ticketQuantity?.connectingFlight?.departureAirport_start_journey?.seatsBooked,
            },
          }
        );
        await Flight.findOne(
          { "itineraries.flight_id": req.body.connectingFlight?.connectingAirport_connecting_journey?.flight_id },
          { "itineraries.$": 1 }
        );
        await Flight.updateOne(
          { "itineraries.flight_id": req.body.connectingFlight?.connectingAirport_connecting_journey?.flight_id },
          {
            $inc: {
              "itineraries.$.availableSeats":
                -ticketQuantity?.connectingFlight?.connectingAirport_connecting_journey?.seatsBooked,
            },
          }
        );
        return res.status(200).send("Available seats have been updated");
      }
      return res.status(404).send("No seats booked");
    }
    return res.status(405).send("no flight_id provided");
  }
);

export default app;
