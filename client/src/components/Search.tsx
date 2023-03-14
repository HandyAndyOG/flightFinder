import React, { useState, useContext } from "react";
import DatePicker, { setDefaultLocale, registerLocale } from "react-datepicker";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
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
    if (!checkbox) {
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
    <section className="border mt-2 px-3 py-5 mb-3">
      <form onSubmit={handleSubmit}>
        <label>Depart from: </label>
        <input className='border py-1 px-2 mr-1'
          placeholder="e.g. Stockholm"
          value={departureAt}
          onChange={(e) => setDepartureAt(e.target.value)}
        />
        <label>Arrive At: </label>
        <input className='border py-1 px-2 mr-1'
          placeholder="e.g. Oslo"
          value={arrivalAt}
          onChange={(e) => setArrivalAt(e.target.value)}
        />
        <label>Round Trip</label>
        <input type="checkbox" onChange={() => setCheckbox(!checkbox)} />
        {checkbox ? (
          <>
            <h2>Round trip</h2>
            <div>
              <h3>Departing trip</h3>
              <label>Depart Date</label>
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
                placeholderText="select date & time"

              />
              <label>Arrival Date</label>
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
            </div>
            <div>
              <h3>Return Trip</h3>
            </div>
          </>
        ) : (
          <section className="border mt-2 px-3 py-5">
            <h2 className="self-center">One Way</h2>
            <div className='flex flex-row'>
              <label className='w-6/12'>Depart Date: </label>
              <DatePicker
                className="border"
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
              <label className='w-6/12'>Arrival Date: </label>
              <DatePicker
                className="border"
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
            </div>
          </section>
        )}
        <button className='border-solid border rounded px-3 py-1 mt-1' type="submit">Search</button>
      </form>
    </section>
  );
};

export default Search;
