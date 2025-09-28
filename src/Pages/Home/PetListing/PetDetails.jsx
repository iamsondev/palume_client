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
    return (
      <p className="text-center py-10 text-gray-700 dark:text-gray-300">
        Loading pet details...
      </p>
    );
  if (isError || !pet)
    return (
      <p className="text-center py-10 text-red-500 dark:text-red-400">
        Failed to load pet details.
      </p>
    );

  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adoptionData = {
      petId: pet._id,
      userName: user?.displayName || "Anonymous",
      userEmail: user?.email,
      phone,
      address,
    };

    try {
      await axiosSecure.post("/adoptions", adoptionData);
      Swal.fire(
        "Success!",
        "Adoption request submitted successfully!",
        "success"
      );
      setIsModalOpen(false);
      navigate("/pets");
    } catch (err) {
      Swal.fire("Error!", "Failed to submit adoption request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Pet Details */}
      <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <img
          src={`${pet.image}?w=600&h=450&fit=crop&auto=format,compress`}
          srcSet={`
            ${pet.image}?w=400&h=300&fit=crop&auto=format,compress 400w,
            ${pet.image}?w=600&h=450&fit=crop&auto=format,compress 600w,
            ${pet.image}?w=800&h=600&fit=crop&auto=format,compress 800w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={pet.name}
          loading="lazy"
          className="w-full md:w-1/2 h-80 object-cover rounded-l-xl bg-gray-100 dark:bg-gray-700"
        />

        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              {pet.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Age: {pet.age}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Category: {pet.category}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Location: {pet.location}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Added on: {new Date(pet.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 transition-colors"
          >
            Adopt
          </button>
        </div>
      </div>

      {/* Adoption Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Adopt {pet.name}
            </h3>

            {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}

            <form onSubmit={handleAdoptSubmit} className="space-y-4">
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Pet Name:
                </p>
                <p className="dark:text-gray-100">{pet.name}</p>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || user?.name || ""}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 transition-colors"
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
