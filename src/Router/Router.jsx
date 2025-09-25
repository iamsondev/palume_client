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
import UpdatePet from "../Pages/Dashboard/UpdatePet";
import CreateDonationCampaign from "../Pages/Dashboard/CreateDonationCampaign";
import MyDonationCampaign from "../Pages/Dashboard/MyDonationCampaign";
import EditDonationCampaign from "../Pages/Dashboard/EditDonationCampaign";
import MyDonation from "../Pages/Dashboard/MyDonation";
import AdoptionRequest from "../Pages/Dashboard/AdoptionRequest";
import PrivateRoute from "../Pages/Routes/PrivateRoute";
import Forbidden from "../Pages/Home/Forbidden";
import DonationDetailsWrapper from "../Pages/Home/DonationalCamp/DonationDetailsWrapper";

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
        path: "pets",
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
      {
        path: "donation-details/:id",
        element: <DonationDetailsWrapper></DonationDetailsWrapper>,
      },

      {
        path: "forbidden",
        element: <Forbidden></Forbidden>,
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
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome></DashboardHome>,
      },
      {
        path: "add-pet",
        element: <AddAPet></AddAPet>,
      },
      {
        path: "my-pets",
        element: <MyAddedPets></MyAddedPets>,
      },
      {
        path: "update-pet/:id",
        element: <UpdatePet></UpdatePet>,
      },
      {
        path: "create-donation",
        element: <CreateDonationCampaign></CreateDonationCampaign>,
      },
      {
        path: "my-donation-campaign",
        element: <MyDonationCampaign></MyDonationCampaign>,
      },
      {
        path: "edit-donation-campaign/:id",
        element: <EditDonationCampaign />,
      },
      {
        path: "my-donations",
        element: <MyDonation></MyDonation>,
      },
      {
        path: "adoption-requests",
        element: <AdoptionRequest></AdoptionRequest>,
      },
    ],
  },
]);
