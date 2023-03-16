interface Prices {
  currency: string;
  adult: number;
  child: number;
}
interface Layover {
  hours: number;
  minutes: number
}
interface Itinerary {
  connectingAirport_connecting_journey: Itinerary;
  departureAirport_start_journey: Itinerary;
  layover: Layover;
  flight_id: string;
  flightTime: Layover;
  departureAt: string;
  arrivalAt: string;
  availableSeats: number;
  prices: Prices;
  _id: string;
}
export interface Flights {
  route_id: string;
  departureDestination: string;
  arrivalDestination: string;
  intermediateDestination: string;
  itineraries: Itinerary[];
}

export interface User {
  email: string;
  uid: string;
  cart: FlightType[];
}

interface Tickets {
  adultQuantity: number;
  adultPrice: number;
  childQuantity: number;
  childPrice: number;
}
interface Cart {
  flight_id: string;
  departureAt: string;
  arrivalAt: string;
  seatsBooked: number;
  tickets: Tickets;
}
interface ConnectingFlight {
  departureAirport_start_journey: Cart;
  connectingAirport_connecting_journey: Cart;
}
interface FlightType {
  directFlight: Cart;
  connectingFlight: ConnectingFlight;
}
// export interface Cart {
//   userId: string | undefined;
//   cart: UserCart[];
// }

export interface States {
  allFlights: Flights[];
  setAllFlights: React.Dispatch<React.SetStateAction<Flights[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  search: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  token: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  filter: string[];
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  deleteFlightCart: boolean;
  setDeleteFlightCart: React.Dispatch<React.SetStateAction<boolean>>;
  addedToCart: boolean;
  setAddedToCart: React.Dispatch<React.SetStateAction<boolean>>;
  checkbox: boolean;
  setCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  localstorage: string | null
  setLocalstorage: React.Dispatch<React.SetStateAction<string | null>>
  departureAt: string | undefined
  setDepartureAt: React.Dispatch<React.SetStateAction<string | undefined>>
  arrivalAt: string | undefined
  setArrivalAt: React.Dispatch<React.SetStateAction<string | undefined>>
  cartCount: number
  setCartCount: React.Dispatch<React.SetStateAction<number>>
  returnEndDate: Date | null, 
  setReturnEndDate: React.Dispatch<React.SetStateAction<Date | null>>
  returnStartDate: Date | null, 
  setReturnStartDate: React.Dispatch<React.SetStateAction<Date | null>>
}
