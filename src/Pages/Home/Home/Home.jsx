import React from 'react';
import Banner from '../Banner';
import AboutUs from '../AboutUs';
import UpcomingEvents from '../UpcomingEvents';
import Testimonials from '../Testimonials';
import PetCategories from '../PetCategories';
import CallToAction from '../CallToAction';
const Home = () => {
  return (
    <div>
       <Banner></Banner>
       <PetCategories></PetCategories>
       <CallToAction></CallToAction>
       <UpcomingEvents></UpcomingEvents>
       <Testimonials></Testimonials>
       <AboutUs></AboutUs>
    </div>
  );
};

export default Home;