import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPause, FaPlay } from "react-icons/fa";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["allDonations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/donations");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.delete(`/admin/donations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["allDonations"]);
      Swal.fire("Deleted!", "Donation deleted successfully.", "success");
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: async ({ id, paused }) =>
      await axiosSecure.patch(`/admin/donations/${id}`, { paused: !paused }),
    onSuccess: () => {
      queryClient.invalidateQueries(["allDonations"]);
      Swal.fire("Updated!", "Donation status updated.", "success");
    },
  });

  const handleEdit = async (donation) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Donation",
      html:
        `<input id="swal-title" class="swal2-input" placeholder="Title" value="${
          donation.title ?? ""
        }">` +
        `<input id="swal-max" class="swal2-input" placeholder="Max Amount" value="${
          donation.maxAmount ?? ""
        }">`,
      focusConfirm: false,
      preConfirm: () => ({
        title: document.getElementById("swal-title").value,
        maxAmount: document.getElementById("swal-max").value,
      }),
    });

    if (formValues) {
      try {
        await axiosSecure.patch(`/admin/donations/${donation._id}`, formValues);
        queryClient.invalidateQueries(["allDonations"]);
        Swal.fire("Updated!", "Donation updated successfully.", "success");
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Update failed",
          "error"
        );
      }
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleTogglePause = (donation) => {
    togglePauseMutation.mutate({ id: donation._id, paused: donation.paused });
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  if (donations.length === 0)
    return (
      <p className="p-4 text-gray-800 dark:text-gray-200">
        No donation campaigns found.
      </p>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        All Donations ({donations.length})
      </h2>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Owner Email</th>
              <th className="px-4 py-2 border">Max Amount</th>
              <th className="px-4 py-2 border">Paused</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, idx) => (
              <tr
                key={donation._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 border">{idx + 1}</td>
                <td className="px-4 py-2 border">{donation.title ?? "N/A"}</td>
                <td className="px-4 py-2 border">
                  {donation.ownerEmail ?? "N/A"}
                </td>
                <td className="px-4 py-2 border">{donation.maxAmount ?? 0}</td>
                <td className="px-4 py-2 border">
                  {donation.paused ? "Paused" : "Active"}
                </td>
                <td className="px-4 py-2 border flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTogglePause(donation)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    {donation.paused ? <FaPlay /> : <FaPause />}
                  </button>
                  <button
                    onClick={() => handleEdit(donation)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(donation._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
        {donations.map((donation, idx) => (
          <div
            key={donation._id}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                {donation.title ?? "N/A"}
              </h3>
              <span className="text-gray-500 dark:text-gray-400">
                #{idx + 1}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Owner Email:</strong> {donation.ownerEmail ?? "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Max Amount:</strong> {donation.maxAmount ?? 0}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Status:</strong> {donation.paused ? "Paused" : "Active"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTogglePause(donation)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                {donation.paused ? <FaPlay /> : <FaPause />}
              </button>
              <button
                onClick={() => handleEdit(donation)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(donation._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDonations;
