import { createBrowserRouter } from "react-router";
import RootLayout from "../Lauouts/Rootlayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Lauouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import PetListing from "../Pages/Home/PetListing/PetListing";
import PetDetails from "../Pages/Home/PetListing/PetDetails";
import DonationCamp from "../Pages/Home/DonationalCamp/DonationCamp";
import DashboardLayout from "../Lauouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import AddAPet from "../Pages/Dashboard/AddAPet";
import MyAddedPets from "../Pages/Dashboard/MyAddedPets";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "petList",
        Component: PetListing,
      },
      {
        path: "petDetails/:id",
        Component: PetDetails,
      },
      {
        path: "donationCamp",
        Component: DonationCamp,
      },
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "add-pet",
        element: <AddAPet></AddAPet>,
      },
      {
        path: "my-pets",
        element: <MyAddedPets></MyAddedPets>,
      },
    ],
  },
]);
