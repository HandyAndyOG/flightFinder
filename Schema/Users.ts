import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  adultQuantity: Number,
  adultPrice: Number,
  childQuantity: Number,
  childPrice: Number,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  uid: String,
  cart: [
    {
      directFlight: {
        flight_id: String,
        departureAt: String,
        arrivalAt: String,
        seatsBooked: Number,
        tickets: ticketSchema,
      },
      connectingFlight: {
        departureAirport_start_journey: {
          flight_id: String,
          departureAt: String,
          arrivalAt: String,
          seatsBooked: Number,
          tickets: ticketSchema,
        },
        connectingAirport_connecting_journey: {
          flight_id: String,
          departureAt: String,
          arrivalAt: String,
          seatsBooked: Number,
          tickets: ticketSchema,
        },
      },
    },
  ],
});


export default userSchema;
