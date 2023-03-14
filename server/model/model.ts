import mongoose from "mongoose";
import flightSchema from "../Schema/Flights";
import userSchema from "../Schema/Users";

export const Users = mongoose.model("Users", userSchema, "Users")
export const Flight = mongoose.model("Flight", flightSchema, "FlightData")
