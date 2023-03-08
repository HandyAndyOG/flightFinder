import mongoose from "mongoose";
import flightSchema from "../Schema/Flights";

export const Flight = mongoose.model("Flight", flightSchema, "FlightData")
