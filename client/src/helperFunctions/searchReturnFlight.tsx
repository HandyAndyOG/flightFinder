export const searchReturnFlight = (returnStartDate: any, 
    returnEndDate: any, setAllFlights: any, departureAt: string | undefined,
    arrivalAt: string | undefined) => {
      fetch(`${process.env.REACT_APP_URL}api/flights/selectedTimes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departureAt: arrivalAt,
          arrivalAt: departureAt,
          departureTime: returnStartDate?.toISOString(),
          arrivalTime: returnEndDate?.toISOString(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          return (setAllFlights(data), console.log(data));
        })
        .catch((err) => console.log(err))
  };