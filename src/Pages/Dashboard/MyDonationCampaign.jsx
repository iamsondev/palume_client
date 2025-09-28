// MyDonationCampaign.jsx
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
  const [pauseLoadingId, setPauseLoadingId] = useState(null);

  const fetchMyCampaigns = async () => {
    try {
      const res = await axiosSecure.get("/donationCampaigns/my-campaigns");
      return res.data;
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch campaigns",
        "error"
      );
      return [];
    }
  };

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["myCampaigns"],
    queryFn: fetchMyCampaigns,
  });

  const pauseMutation = useMutation({
    mutationFn: async (id) => {
      setPauseLoadingId(id);
      const res = await axiosSecure.patch(`/donationCampaigns/pause/${id}`);
      return { ...res.data, _id: id };
    },
    onMutate: async (id) => {
      setPauseLoadingId(id);
      await queryClient.cancelQueries(["myCampaigns"]);
      const previous = queryClient.getQueryData(["myCampaigns"]);
      queryClient.setQueryData(["myCampaigns"], (old) =>
        old.map((camp) =>
          camp._id === id ? { ...camp, paused: !camp.paused } : camp
        )
      );
      return { previous };
    },
    onError: (err, id, context) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Server error",
        "error"
      );
      queryClient.setQueryData(["myCampaigns"], context.previous);
      setPauseLoadingId(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["myCampaigns"]);
      setPauseLoadingId(null);
    },
  });

  const viewDonators = async (id) => {
    try {
      const res = await axiosSecure.get(`/donationCampaigns/donators/${id}`);
      setDonatorsModal({ open: true, donators: res.data || [] });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch donators", "error");
    }
  };

  if (isLoading) return <p>Loading campaigns...</p>;

  return (
    <div className="p-2 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        My Donation Campaigns
      </h2>

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <>
          {/* Desktop / Tablet: Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded">
              <thead className="bg-gray-200 dark:bg-gray-800 sticky top-0">
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
                  const currentAmount =
                    campaign.currentAmount ||
                    (campaign.donators || []).reduce(
                      (sum, d) => sum + d.amount,
                      0
                    );
                  const progress = Math.min(
                    100,
                    (currentAmount / campaign.maxAmount) * 100
                  );
                  const isPausing = pauseLoadingId === campaign._id;

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
                      <td className="px-4 py-2 space-x-2 flex flex-wrap">
                        <button
                          className={`px-3 py-1 rounded text-white ${
                            campaign.paused
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-red-500 hover:bg-red-600"
                          } ${
                            isPausing
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={() => pauseMutation.mutate(campaign._id)}
                          disabled={isPausing}
                        >
                          {isPausing
                            ? "Updating..."
                            : campaign.paused
                            ? "Unpause"
                            : "Pause"}
                        </button>
                        <button
                          className="px-3 py-1 bg-emerald-600 text-white rounded"
                          onClick={() =>
                            navigate(
                              `/dashboard/edit-donation-campaign/${campaign._id}`
                            )
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

          {/* Mobile: Card Style */}
          <div className="sm:hidden space-y-4">
            {campaigns.map((campaign) => {
              const currentAmount =
                campaign.currentAmount ||
                (campaign.donators || []).reduce((sum, d) => sum + d.amount, 0);
              const progress = Math.min(
                100,
                (currentAmount / campaign.maxAmount) * 100
              );
              const isPausing = pauseLoadingId === campaign._id;

              return (
                <div
                  key={campaign._id}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow space-y-2"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">Pet Name:</span>
                    <span>{campaign.petName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Max Amount:</span>
                    <span>${campaign.maxAmount}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Progress:</span>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded mt-1">
                      <div
                        className="bg-green-500 h-3 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span>{campaign.paused ? "Paused" : "Active"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      className={`px-3 py-1 rounded text-white ${
                        campaign.paused
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-red-500 hover:bg-red-600"
                      } ${
                        isPausing
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => pauseMutation.mutate(campaign._id)}
                      disabled={isPausing}
                    >
                      {isPausing
                        ? "Updating..."
                        : campaign.paused
                        ? "Unpause"
                        : "Pause"}
                    </button>
                    <button
                      className="px-3 py-1 bg-emerald-600 text-white rounded"
                      onClick={() =>
                        navigate(
                          `/dashboard/edit-donation-campaign/${campaign._id}`
                        )
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
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Donators Modal */}
      {donatorsModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Donators</h3>
            {donatorsModal.donators.length === 0 ? (
              <p>No donations yet.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {donatorsModal.donators.map((donator, idx) => (
                  <li
                    key={donator._id || `${donator.email}-${idx}`}
                    className="flex justify-between text-xs sm:text-sm"
                  >
                    <span>{donator.name}</span>
                    <span>${donator.amount}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
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
