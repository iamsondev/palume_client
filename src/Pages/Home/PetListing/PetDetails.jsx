import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../Hook/useAuth";

const PetDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch pet details
  const {
    data: pet,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading)
    return <p className="text-center py-10">Loading pet details...</p>;
  if (isError || !pet)
    return <p className="text-center py-10">Failed to load pet details.</p>;

  // Submit adoption request
  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.image,
      userName: user?.displayName || "Anonymous",
      userEmail: user?.email,
      phone,
      address,
      status: "pending",
      createdAt: new Date(),
    };

    console.log("Adoption Data:", adoptionData);

    try {
      const res = await axiosSecure.post("/adoptions", adoptionData);

      // SweetAlert success
      Swal.fire({
        title: "Success!",
        text: "Adoption request submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      setPhone("");
      setAddress("");
      setIsModalOpen(false);
      navigate("/petList");
    } catch (err) {
      console.error(
        "Error submitting adoption:",
        err.response?.data || err.message
      );

      // SweetAlert error
      Swal.fire({
        title: "Error!",
        text: "Failed to submit adoption request. Please fill all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Pet Details */}
      <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full md:w-1/2 h-80 object-cover rounded-l-xl"
        />
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              {pet.name}
            </h2>
            <p className="text-gray-600 mb-1">Age: {pet.age}</p>
            <p className="text-gray-600 mb-1">Category: {pet.category}</p>
            <p className="text-gray-600 mb-1">Location: {pet.location}</p>
            <p className="text-gray-500 text-sm mt-2">
              Added on: {new Date(pet.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-colors"
          >
            Adopt
          </button>
        </div>
      </div>

      {/* Adoption Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Adopt {pet.name}
            </h3>

            {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}

            <form onSubmit={handleAdoptSubmit} className="space-y-4">
              {/* Pet Info (programmatic) */}
              <div>
                <p className="text-gray-700 font-medium">Pet Name:</p>
                <p>{pet.name}</p>
              </div>

              {/* User Info */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || user?.name || ""}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Editable Fields */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-colors"
              >
                {loading ? "Submitting..." : "Submit Adoption Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
