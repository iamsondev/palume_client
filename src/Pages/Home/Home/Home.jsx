import React from 'react';
import Banner from '../Banner';
import AboutUs from '../AboutUs';
import UpcomingEvents from '../UpcomingEvents';
import Testimonials from '../Testimonials';
const Home = () => {
  return (
    <div>
       <Banner></Banner>
       <UpcomingEvents></UpcomingEvents>
       <Testimonials></Testimonials>
       <AboutUs></AboutUs>
    </div>
  );
};

export default Home;