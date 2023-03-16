export const bookFlight = (
  data: any,
  selectedChildOption: any,
  selectedAdultOption: any,
  selectedChildConnectingOption: any,
  selectedAdultConnectingOption: any,
  token: string | undefined,
  setSelectedChildOption: any,
  setAddedToCart: any,
  addedToCart: any,
  setSelectedChildConnectingOption: any,
  setSelectedAdultConnectingOption: any,
  setSelectedAdultOption: any,
  selectedChildDirectOption: any,
  selectedAdultDirectOption: any,
  setSelectedAdultDirectOption: any,
  setSelectedChildDirectOption: any,
  checkbox: boolean,
  setAllFlights: any,
  searchReturnFlight: any,
  returnStartDate: any,
  returnEndDate: any,
  departureAt: string | undefined,
  arrivalAt: string | undefined,
  showToastMessage: any
) => {
  if (!checkbox) {
    if (Number(selectedChildOption) > 0 || Number(selectedAdultOption) > 0) {
      const flight = {
        departureAirport_start_journey: {
          flight_id: data.departureAirport_start_journey.flight_id,
          departureAt: data.departureAirport_start_journey.departureAt,
          arrivalAt: data.departureAirport_start_journey.arrivalAt,
          seatsBooked:
            Number(selectedChildOption) + Number(selectedAdultOption),
          adultQuantity: selectedAdultOption,
          adultPrice: data.departureAirport_start_journey.prices.adult,
          childQuantity: selectedChildOption,
          childPrice: data.departureAirport_start_journey.prices.child,
        },
        connectingAirport_connecting_journey: {
          flight_id: data.connectingAirport_connecting_journey.flight_id,
          departureAt: data.connectingAirport_connecting_journey.departureAt,
          arrivalAt: data.connectingAirport_connecting_journey.arrivalAt,
          seatsBooked:
            Number(selectedChildConnectingOption) +
            Number(selectedAdultConnectingOption),
          adultQuantity: selectedAdultOption,
          adultPrice: data.connectingAirport_connecting_journey.prices.adult,
          childQuantity: selectedChildOption,
          childPrice: data.connectingAirport_connecting_journey.prices.child,
        },
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(flight),
      };
      fetch("http://localhost:8080/api/user/cart", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if(data.status === 'success') {
            setAddedToCart(!addedToCart)
            showToastMessage()
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setSelectedChildOption("");
          setSelectedChildConnectingOption("");
          setSelectedAdultConnectingOption("");
          setSelectedAdultOption("");
        });
    } else if (
      Number(selectedChildDirectOption) > 0 ||
      Number(selectedAdultDirectOption) > 0
    ) {
      const flight = {
        flight_id: data.flight_id,
        departureAt: data.departureAt,
        arrivalAt: data.arrivalAt,
        seatsBooked:
          Number(selectedAdultDirectOption) + Number(selectedChildDirectOption),
        adultQuantity: Number(selectedAdultDirectOption),
        adultPrice: data.prices.adult,
        childQuantity: Number(selectedChildDirectOption),
        childPrice: data.prices.child,
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(flight),
      };
      fetch("http://localhost:8080/api/user/cart", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if(data.status === 'success') {
            setAddedToCart(!addedToCart)
            showToastMessage()
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setSelectedAdultDirectOption("");
          setSelectedChildDirectOption("");
        });
    }
  } else {
    if (Number(selectedChildOption) > 0 || Number(selectedAdultOption) > 0) {
      const flight = {
        departureAirport_start_journey: {
          flight_id: data.departureAirport_start_journey.flight_id,
          departureAt: data.departureAirport_start_journey.departureAt,
          arrivalAt: data.departureAirport_start_journey.arrivalAt,
          seatsBooked:
            Number(selectedChildOption) + Number(selectedAdultOption),
          adultQuantity: selectedAdultOption,
          adultPrice: data.departureAirport_start_journey.prices.adult,
          childQuantity: selectedChildOption,
          childPrice: data.departureAirport_start_journey.prices.child,
        },
        connectingAirport_connecting_journey: {
          flight_id: data.connectingAirport_connecting_journey.flight_id,
          departureAt: data.connectingAirport_connecting_journey.departureAt,
          arrivalAt: data.connectingAirport_connecting_journey.arrivalAt,
          seatsBooked:
            Number(selectedChildConnectingOption) +
            Number(selectedAdultConnectingOption),
          adultQuantity: selectedAdultOption,
          adultPrice: data.connectingAirport_connecting_journey.prices.adult,
          childQuantity: selectedChildOption,
          childPrice: data.connectingAirport_connecting_journey.prices.child,
        },
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(flight),
      };
      fetch("http://localhost:8080/api/user/cart", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if(data.status === 'success') {
            setAddedToCart(!addedToCart)
            showToastMessage()
          }        })
        .catch((err) => console.log(err))
        .finally(() => {
          setSelectedChildOption("");
          setSelectedChildConnectingOption("");
          setSelectedAdultConnectingOption("");
          setSelectedAdultOption("");
          // setAllFlights([]);
          searchReturnFlight(returnStartDate, returnEndDate, setAllFlights, departureAt,
            arrivalAt);
        });
    } else if (
      Number(selectedChildDirectOption) > 0 ||
      Number(selectedAdultDirectOption) > 0
    ) {
      const flight = {
        flight_id: data.flight_id,
        departureAt: data.departureAt,
        arrivalAt: data.arrivalAt,
        seatsBooked:
          Number(selectedAdultDirectOption) + Number(selectedChildDirectOption),
        adultQuantity: Number(selectedAdultDirectOption),
        adultPrice: data.prices.adult,
        childQuantity: Number(selectedChildDirectOption),
        childPrice: data.prices.child,
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(flight),
      };
      fetch("http://localhost:8080/api/user/cart", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if(data.status === 'success') {
            setAddedToCart(!addedToCart)
            showToastMessage()
          }        })
        .catch((err) => console.log(err))
        .finally(() => {
          setSelectedAdultDirectOption("");
          setSelectedChildDirectOption("");
          searchReturnFlight(returnStartDate, returnEndDate, setAllFlights, departureAt,
            arrivalAt);
        });
    }
  }
};
