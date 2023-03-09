import mongoose from "mongoose";

const pricesSchema = new mongoose.Schema({
  currency: String,
  adult: Number,
  child: Number,
});
const flightSchema = new mongoose.Schema({
  route_id: String,
  departureDestination: String,
  arrivalDestination: String,
  itineraries: [
    {
      flight_id: String,
      departureAt: String,
      arrivalAt: String,
      availableSeats: Number,
      prices: pricesSchema,
    },
  ],
});

export default flightSchema;
