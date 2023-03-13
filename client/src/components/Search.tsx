import React, { useState, useContext } from "react";
import DatePicker, { setDefaultLocale, registerLocale } from "react-datepicker";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { CLIENT_RENEG_LIMIT } from "tls";
import { start } from "repl";
import { FlightContext } from "../stateManagement/FlightContext";

setDefaultLocale("en");
registerLocale("en", enGB);

const Search = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [checkbox, setCheckbox] = useState(false);
  const [departureAt, setDepartureAt] = useState<string | undefined>("");
  const [arrivalAt, setArrivalAt] = useState<string | undefined>("");
  const { allFlights, setAllFlights, user, token, setToken, localstorage } =
    useContext(FlightContext);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkbox) {
      fetch("http://localhost:8080/api/flights/selectedTimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departureAt: departureAt,
          arrivalAt: arrivalAt,
          departureTime: startDate?.toISOString(),
          arrivalTime: endDate?.toISOString(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          return setAllFlights(data), console.log(data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setStartDate(null);
          setEndDate(null);
          setDepartureAt("");
          setArrivalAt("");
        });
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <label>Depart from: </label>
        <input
          placeholder="e.g. Stockholm"
          value={departureAt}
          onChange={(e) => setDepartureAt(e.target.value)}
        />
        <label>Arrive At: </label>
        <input
          placeholder="e.g. Oslo"
          value={arrivalAt}
          onChange={(e) => setArrivalAt(e.target.value)}
        />
        <label>Return</label>
        <input type="checkbox" onChange={() => setCheckbox(!checkbox)} />
        {checkbox ? (
          <>
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
              locale="en"
              showTimeInput
              timeFormat="HH:mm:ss"
              timeIntervals={15}
              shouldCloseOnSelect={false}
              showTimeSelect
              timeCaption="Time"
            />
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
              locale="en"
              minDate={startDate}
              showTimeInput
              timeFormat="HH:mm:ss"
              timeIntervals={15}
              shouldCloseOnSelect={false}
              showTimeSelect
              timeCaption="Time"
            />
          </>
        ) : (
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            locale="en"
            dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
            showTimeInput
            timeFormat="HH:mm:ss"
            timeIntervals={15}
            shouldCloseOnSelect={false}
            showTimeSelect
            timeCaption="Time"
          />
        )}

        <button type="submit">Search</button>
      </form>
    </section>
  );
};

export default Search;
