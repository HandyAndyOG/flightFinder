export const searchReturnFlight = (returnStartDate: any, 
    returnEndDate: any, setAllFlights: any, departureAt: string | undefined,
    arrivalAt: string | undefined) => {
      fetch("http://localhost:8080/api/flights/selectedTimes", {
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