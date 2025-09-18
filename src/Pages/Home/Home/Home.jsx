import React from 'react';
import Banner from '../Banner';
import AboutUs from '../AboutUs';
import UpcomingEvents from '../UpcomingEvents';
const Home = () => {
  return (
    <div>
       <Banner></Banner>
       <UpcomingEvents></UpcomingEvents>
       <AboutUs></AboutUs>
    </div>
  );
};

export default Home;