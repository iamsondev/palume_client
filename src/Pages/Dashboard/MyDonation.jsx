import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

const MyDonation = () => {
  const axiosSecure = useAxiosSecure();
  const [donations, setDonations] = useState([]);

  const { isLoading } = useQuery({
    queryKey: ["myDonations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donations/my-donations");
      setDonations(res.data); // save to local state
      return res.data;
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch donations",
        "error"
      );
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (campaignId) => {
      const res = await axiosSecure.delete(`/donations/refund/${campaignId}`);
      return res.data;
    },
    onSuccess: (_, campaignId) => {
      setDonations((prev) =>
        prev.filter((donation) => donation.campaignId !== campaignId)
      );
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

  if (isLoading)
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    );

  if (donations.length === 0)
    return (
      <p className="p-4 text-gray-800 dark:text-gray-200">
        You have not made any donations yet.
      </p>
    );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        My Donations
      </h2>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
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
                className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
        {donations.map((donation) => (
          <div
            key={donation.campaignId}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                {donation.petName}
              </h3>
              <img
                src={donation.imageUrl}
                alt={donation.petName}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Amount:</strong> ${donation.amount}
            </p>
            <button
              onClick={() => refundMutation.mutate(donation.campaignId)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-max"
            >
              Refund
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonation;
