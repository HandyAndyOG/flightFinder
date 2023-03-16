export const seeFlight = (data: any, setClicked: any) => {
    const flightId = data._id;
    setClicked((prevState: any) => ({
      ...prevState,
      [flightId]: !prevState[flightId],
    }));
  };