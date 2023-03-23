import React from "react";
import Search from "./Search";
import FlightCard from "./FlightCard";
import Nav from "./Nav";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {

  return (
    <>
      <Nav />
    <section className="flex flex-col items-center bg-indigo-100 h-96 justify-center">
      <Search />
    </section>
    <section className="flex flex-col items-center mt-5">
      <FlightCard />
      <ToastContainer />
    </section>
    </>
  );
};

export default Home;
