import React, { useState, useContext } from "react";
import DatePicker, { setDefaultLocale, registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { FlightContext } from "../stateManagement/FlightContext";
import { SearchProps } from "../Types/types";

setDefaultLocale("en");
registerLocale("en", enGB);

const Search: React.FC<SearchProps>= ({scrollFunction}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const {
    setAllFlights,
    checkbox,
    setCheckbox,
    returnStartDate,
    setReturnStartDate,
    returnEndDate,
    setReturnEndDate,
    arrivalAt,
    setArrivalAt,
    departureAt,
    setDepartureAt,
  } = useContext(FlightContext);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };
  const handleReturnStartDateChange = (date: Date | null) => {
    setReturnStartDate(date);
  };

  const handleReturnEndDateChange = (date: Date | null) => {
    setReturnEndDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_URL}api/flights/selectedTimes`, {
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
        return (setAllFlights(data));
      })
      .finally(() => {
        scrollFunction()
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="rounded-lg bg-indigo-400/75 text-white shadow mt-2 px-3 py-5 mb-3 w-4/5">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
        <label>Depart from: </label>
        <input
          className="py-1 px-2 mr-3 rounded-full shadow-inner text-indigo-900"
          placeholder="e.g. Stockholm"
          value={departureAt}
          onChange={(e) => setDepartureAt(e.target.value)}
        />
        <label>Arrive At: </label>
        <input
          className="py-1 px-2 mr-3 rounded-full shadow-inner text-indigo-900"
          placeholder="e.g. Oslo"
          value={arrivalAt}
          onChange={(e) => setArrivalAt(e.target.value)}
        />
        <div className="flex flex-row">

        <label>Round Trip: </label>
        <input type="checkbox" onChange={() => setCheckbox(!checkbox)} />
        </div>

        </div>
        {checkbox ? (
          <>
            <section className="mt-2 px-3 py-5">
              <h2 className="self-center font-semibold">Departure trip</h2>
              <div className="flex flex-col sm:flex-row">
                <label className="w-6/12">Depart Date: </label>
                <DatePicker
                  className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
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
                <label className="w-6/12">Arrival Date: </label>
                <DatePicker
                  className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
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
            <section className="mt-2 px-3 py-5">
              <h2 className="self-center font-semibold">Return trip</h2>
              <div className="flex flex-col sm:flex-row">
                <label className="w-6/12">Depart Date: </label>
                <DatePicker
                  className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
                  selected={returnStartDate}
                  onChange={handleReturnStartDateChange}
                  selectsStart
                  startDate={returnStartDate}
                  endDate={returnEndDate}
                  dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                  locale="en"
                  showTimeInput
                  timeFormat="HH:mm:ss"
                  timeIntervals={15}
                  shouldCloseOnSelect={false}
                  showTimeSelect
                  timeCaption="Time"
                />
                <label className="w-6/12">Arrival Date: </label>
                <DatePicker
                  className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
                  selected={returnEndDate}
                  onChange={handleReturnEndDateChange}
                  selectsEnd
                  startDate={returnStartDate}
                  endDate={returnEndDate}
                  dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                  locale="en"
                  minDate={returnStartDate}
                  showTimeInput
                  timeFormat="HH:mm:ss"
                  timeIntervals={15}
                  shouldCloseOnSelect={false}
                  showTimeSelect
                  timeCaption="Time"
                />
              </div>
            </section>
          </>
        ) : (
          <section className="border rounded mt-2 px-3 py-5">
            <h2 className="self-center">One Way</h2>
            <div className="flex flex-col sm:flex-row">
              <label className="w-6/12">Depart Date: </label>
              <DatePicker
                className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
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
              <label className="w-6/12">Arrival Date: </label>
              <DatePicker
                className="py-1 px-2 mr-1 rounded-full shadow-inner text-indigo-900"
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
        <button
          className="border-solid border rounded-full bg-white text-indigo-300 ease-in-out duration-300 hover:bg-indigo-300 hover:text-white shadow px-3 py-1 mt-1"
          type="submit"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default Search;
