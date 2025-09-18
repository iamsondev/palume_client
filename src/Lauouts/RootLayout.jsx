import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Home/Navbar';

const RootLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
       <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;