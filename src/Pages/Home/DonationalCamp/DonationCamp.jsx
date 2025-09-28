import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { useNavigate } from "react-router";

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-72"></div>
);

const DonationCamp = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { ref, inView } = useInView({ threshold: 0 });

  const fetchCampaigns = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError("");

    try {
      const res = await axiosSecure.get(
        `/donationCampaigns?page=${page}&limit=6`
      );
      const data = res.data;

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setCampaigns((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Fetch campaigns error:", err);
      setError("Failed to load campaigns. Please try again.");
    }
    setLoading(false);
  };

  // Load first page
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Load next page on scroll
  useEffect(() => {
    if (inView && hasMore) {
      fetchCampaigns();
    }
  }, [inView]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Donation Campaigns
      </h1>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-center mb-4 font-semibold">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp, index) => (
          <div
            key={`${camp._id}-${index}`}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <img
              src={camp.imageUrl}
              alt={camp.petName}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {camp.petName}
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Max Donation: <strong>${camp.maxAmount}</strong>
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                Donated:{" "}
                <strong>
                  $
                  {camp.donators
                    ? camp.donators.reduce((acc, d) => acc + d.amount, 0)
                    : 0}
                </strong>
              </p>
              <button
                onClick={() => navigate(`/donation-details/${camp._id}`)}
                className="mt-4 bg-emerald-500 hover:bg-emerald-700 text-white px-4 py-2 rounded transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* Show skeleton loader while loading */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>

      {/* Observer div for infinite scroll */}
      <div ref={ref} className="text-center my-6">
        {!hasMore && campaigns.length > 0 && (
          <p className="text-gray-500 dark:text-gray-400">No more campaigns</p>
        )}
      </div>
    </div>
  );
};

export default DonationCamp;
