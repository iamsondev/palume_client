// DonationDetailsWrapper.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DonationDetails from "./DonationDetails";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const DonationDetailsWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <DonationDetails />
    </Elements>
  );
};

export default DonationDetailsWrapper;
