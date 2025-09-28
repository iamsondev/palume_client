import React from "react";
import {
  FaPaw,
  FaDonate,
  FaBullhorn,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [
        myPetsRes,
        myDonationsRes,
        donationCampaignsRes,
        allUsersRes,
        allDonationsRes,
        allCampaignsRes,
      ] = await Promise.all([
        axiosSecure.get("/my-added"),
        axiosSecure.get("/donations/my-donations"),
        axiosSecure.get("/donationCampaigns/my-campaigns"),
        axiosSecure.get("/users"),
        axiosSecure.get("/admin/donations"),
        axiosSecure.get("/donationCampaigns"),
      ]);

      return {
        myPets: myPetsRes.data.length,
        myDonations: myDonationsRes.data.length,
        donationCampaigns: donationCampaignsRes.data.length,
        allUsers: allUsersRes.data.length,
        allDonations: allDonationsRes.data.length,
        allCampaigns: allCampaignsRes.data.length,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 মিনিট cache
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading)
    return <span className="loading loading-dots loading-xl"></span>;

  if (isError)
    return (
      <p className="text-red-500">{error?.message || "Failed to load stats"}</p>
    );

  const cards = [
    { label: "My Added Pets", value: stats.myPets, icon: <FaPaw size={30} /> },
    {
      label: "My Donations",
      value: stats.myDonations,
      icon: <FaDonate size={30} />,
    },
    {
      label: "My Donation Campaigns",
      value: stats.donationCampaigns,
      icon: <FaBullhorn size={30} />,
    },
    { label: "All Users", value: stats.allUsers, icon: <FaUsers size={30} /> },
    {
      label: "All Donations",
      value: stats.allDonations,
      icon: <FaMoneyBillWave size={30} />,
    },
    {
      label: "All Campaigns",
      value: stats.allCampaigns,
      icon: <FaClipboardList size={30} />,
    },
  ];

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border dark:border-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition flex items-center space-x-4 bg-white dark:bg-gray-800"
        >
          <div className="text-blue-500 dark:text-blue-400">{card.icon}</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {card.label}
            </h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboardHome;
