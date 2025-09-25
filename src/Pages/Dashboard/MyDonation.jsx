import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

const MyDonation = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["myDonations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donations/my-donations");
      return res.data;
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (campaignId) => {
      const res = await axiosSecure.delete(`/donations/refund/${campaignId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myDonations"]);
      Swal.fire("Success", "Donation refunded!", "success");
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Refund failed",
        "error"
      );
    },
  });

  if (isLoading) return <p>Loading your donations...</p>;

  if (donations.length === 0)
    return <p>You have not made any donations yet.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Donations</h2>
      <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded">
        <thead className="bg-gray-200 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2">Pet Image</th>
            <th className="px-4 py-2">Pet Name</th>
            <th className="px-4 py-2">Donated Amount</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr
              key={index}
              className="border-t border-gray-300 dark:border-gray-700"
            >
              <td className="px-4 py-2">
                <img
                  src={donation.imageUrl}
                  alt={donation.petName}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2">{donation.petName}</td>
              <td className="px-4 py-2">${donation.amount}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => refundMutation.mutate(donation.campaignId)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Refund
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyDonation;
