import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

const AdoptionRequest = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch adoption requests
  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adoptionRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/adoptions/my-pets-requests");
      return res.data;
    },
  });

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/adoptions/accept/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adoptionRequests"]);
      Swal.fire("Accepted!", "Adoption request accepted.", "success");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/adoptions/reject/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adoptionRequests"]);
      Swal.fire("Rejected!", "Adoption request rejected.", "info");
    },
  });

  // Loading state
  if (isLoading)
    return <p className="text-center py-10">Loading adoption requests...</p>;

  // Error state
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load adoption requests.
      </p>
    );

  // No requests
  if (requests.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No adoption requests for your pets yet.
      </p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Adoption Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2">Pet Name</th>
              <th className="px-4 py-2">Requester Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req._id}
                className="border-t border-gray-300 dark:border-gray-700"
              >
                <td className="px-4 py-2">{req.petName}</td>
                <td className="px-4 py-2">{req.userName}</td>
                <td className="px-4 py-2">{req.userEmail}</td>
                <td className="px-4 py-2">{req.phone}</td>
                <td className="px-4 py-2">{req.address}</td>
                <td className="px-4 py-2 capitalize">{req.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                    onClick={() => acceptMutation.mutate(req._id)}
                    disabled={req.status !== "pending"}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    onClick={() => rejectMutation.mutate(req._id)}
                    disabled={req.status !== "pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionRequest;
