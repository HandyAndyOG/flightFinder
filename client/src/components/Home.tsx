import React, {useRef} from "react";
import Search from "./Search";
import FlightCard from "./FlightCard";
import Nav from "./Nav";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import coverImg from '../assets/test1.jpg'


const Home = () => {
  const flightRef = useRef<HTMLDivElement>(null);

  const scrollFunction = () => {
    if (flightRef.current) {
      flightRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
    <Nav />
    <section className="flex flex-col items-center bg-indigo-100 h-screen justify-center" style={{backgroundImage: `url(${coverImg})`, objectFit: 'cover', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
      <Search scrollFunction={scrollFunction}/>
    </section>
    <section className="flex flex-col items-center pt-5 bg-indigo-100" ref={flightRef} >
      <FlightCard  />
      <ToastContainer />
    </section>
    </>
  );
};

export default Home;
