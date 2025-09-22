import React, { useEffect, useState } from "react";
import PetForm from "./PetForm";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";

const UpdatePet = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axiosSecure.get(`/pets/${id}`);
        setPet(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch pet data", "error");
      }
    };
    fetchPet();
  }, [id, axiosSecure]);

  const handleUpdate = async (updatedData) => {
    try {
      await axiosSecure.put(`/pets/${id}`, updatedData);
      Swal.fire("Success", "Pet updated successfully!", "success");
      navigate("/dashboard/my-pets");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update pet", "error");
    }
  };

  if (!pet) return <p>Loading pet data...</p>;

  return (
    <PetForm
      initialValues={pet}
      onSubmit={handleUpdate}
      submitLabel="Update Pet"
    />
  );
};

export default UpdatePet;
