import React from "react";
import PetForm from "./PetForm";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook/useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const AddAPet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleAdd = async (petData) => {
    try {
      // Directly send compressed image URL from PetForm
      await axiosSecure.post("/pets", { ...petData, ownerEmail: user.email });
      Swal.fire("Success", "Pet added successfully!", "success");
      navigate("/dashboard/my-pets");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  return <PetForm onSubmit={handleAdd} submitLabel="Add Pet" />;
};

export default AddAPet;
