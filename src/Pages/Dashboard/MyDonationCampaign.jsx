import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyDonationCampaign = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [donatorsModal, setDonatorsModal] = useState({
    open: false,
    donators: [],
  });

  // Fetch user's campaigns
  const fetchMyCampaigns = async () => {
    const res = await axiosSecure.get("/donationCampaigns/my-campaigns");
    return res.data;
  };

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["myCampaigns"],
    queryFn: fetchMyCampaigns,
  });

  // Pause / Unpause mutation
  const pauseMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/donationCampaigns/pause/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myCampaigns"]);
      Swal.fire("Success", "Campaign updated!", "success");
    },
  });

  // View donators mutation
  const viewDonators = async (id) => {
    try {
      const res = await axiosSecure.get(`/donationCampaigns/donators/${id}`);
      setDonatorsModal({ open: true, donators: res.data });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch donators", "error");
    }
  };

  if (isLoading) return <p>Loading campaigns...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Donation Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">Pet Name</th>
                <th className="px-4 py-2">Max Amount</th>
                <th className="px-4 py-2">Progress</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const progress =
                  Math.min(
                    100,
                    (campaign.currentAmount / campaign.maxAmount) * 100
                  ) || 0;
                return (
                  <tr
                    key={campaign._id}
                    className="border-t border-gray-300 dark:border-gray-700"
                  >
                    <td className="px-4 py-2">{campaign.petName}</td>
                    <td className="px-4 py-2">${campaign.maxAmount}</td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded">
                        <div
                          className="bg-green-500 h-4 rounded"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm">{progress.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-2">
                      {campaign.paused ? "Paused" : "Active"}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className={`px-3 py-1 rounded ${
                          campaign.paused
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                        onClick={() => pauseMutation.mutate(campaign._id)}
                      >
                        {campaign.paused ? "Unpause" : "Pause"}
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                        onClick={() =>
                          navigate(`/dashboard/edit-donation/${campaign._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-purple-500 text-white rounded"
                        onClick={() => viewDonators(campaign._id)}
                      >
                        View Donators
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Donators Modal */}
      {donatorsModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Donators</h3>
            {donatorsModal.donators.length === 0 ? (
              <p>No donations yet.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {donatorsModal.donators.map((donator) => (
                  <li key={donator._id} className="flex justify-between">
                    <span>{donator.name}</span>
                    <span>${donator.amount}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setDonatorsModal({ open: false, donators: [] })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonationCampaign;
