import React from 'react';
import Banner from '../Banner';
import AboutUs from '../AboutUs';
import UpcomingEvents from '../UpcomingEvents';
import Testimonials from '../Testimonials';
import PetCategories from '../PetCategories';
const Home = () => {
  return (
    <div>
       <Banner></Banner>
       <PetCategories></PetCategories>
       <UpcomingEvents></UpcomingEvents>
       <Testimonials></Testimonials>
       <AboutUs></AboutUs>
    </div>
  );
};

export default Home;