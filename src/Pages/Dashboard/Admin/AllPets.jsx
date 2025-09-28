import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

const AllPets = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all pets
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["allPets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/pets");
      return res.data;
    },
  });

  // Delete pet mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/admin/pets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPets"] });
      Swal.fire("Deleted!", "Pet has been deleted.", "success");
    },
  });

  // Toggle adopted status mutation
  const toggleAdoptedMutation = useMutation({
    mutationFn: async ({ id, adopted }) => {
      await axiosSecure.patch(`/admin/pets/${id}`, { adopted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPets"] });
      Swal.fire("Updated!", "Pet status updated.", "success");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  if (pets.length === 0)
    return (
      <p className="p-4 text-gray-800 dark:text-gray-200">No pets found</p>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        All Pets ({pets.length})
      </h2>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 dark:border-gray-600 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Owner Email</th>
              <th className="px-4 py-2 border">Adopted</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet, index) => (
              <tr
                key={pet._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{pet.name}</td>
                <td className="px-4 py-2 border">
                  {pet.category?.label || pet.category || "N/A"}
                </td>
                <td className="px-4 py-2 border">{pet.ownerEmail}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() =>
                      toggleAdoptedMutation.mutate({
                        id: pet._id,
                        adopted: !pet.adopted,
                      })
                    }
                    className={`px-2 py-1 rounded ${
                      pet.adopted
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {pet.adopted ? "Adopted" : "Not Adopted"}
                  </button>
                </td>
                <td className="px-4 py-2 border flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteMutation.mutate(pet._id);
                        }
                      });
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
        {pets.map((pet, index) => (
          <div
            key={pet._id}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                {pet.name}
              </h3>
              <span className="text-gray-500 dark:text-gray-400">
                #{index + 1}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Category:</strong>{" "}
              {pet.category?.label || pet.category || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Owner Email:</strong> {pet.ownerEmail}
            </p>
            <p>
              <button
                onClick={() =>
                  toggleAdoptedMutation.mutate({
                    id: pet._id,
                    adopted: !pet.adopted,
                  })
                }
                className={`px-3 py-1 rounded ${
                  pet.adopted
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {pet.adopted ? "Adopted" : "Not Adopted"}
              </button>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteMutation.mutate(pet._id);
                    }
                  });
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPets;
