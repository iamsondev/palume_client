import { createBrowserRouter } from "react-router";
import RootLayout from "../Lauouts/Rootlayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Lauouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import PetListing from "../Pages/Home/PetListing/PetListing";
import PetDetails from "../Pages/Home/PetListing/PetDetails";


export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children:[
      {
        index:true,
        Component:Home
      },
      {
        path:'petList',
        Component:PetListing
      },
      {
        path:'petDetails/:id',
        Component:PetDetails
      }
    ]
  },
  
    {
      path:'/',
      Component:AuthLayout,
      children:[
        {
          path:'login',
          Component:Login
        },
        {
          path:'register',
          Component:Register
        }
      ]

    },
  
]);