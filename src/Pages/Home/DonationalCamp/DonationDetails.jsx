import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

const DonationDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [campaign, setCampaign] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [amount, setAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardError, setCardError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  // Fetch campaign details
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axiosSecure.get(`/donationCampaigns/${id}`);
        if (res.data) setCampaign(res.data);
      } catch (err) {
        console.error("Fetch campaign error:", err);
      }
    };
    fetchCampaign();
  }, [id, axiosSecure]);

  // Fetch recommended campaigns
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axiosSecure.get(`/donationCampaigns?limit=3`);
        setRecommended(res.data?.filter((c) => c._id !== id) || []);
      } catch (err) {
        console.error("Fetch recommended campaigns error:", err);
      }
    };
    fetchRecommended();
  }, [id, axiosSecure]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !cardComplete) return;

    try {
      setDonating(true);

      // 1️⃣ Create PaymentIntent
      const res = await axiosSecure.post("/create-payment-intent", {
        amount: parseFloat(amount),
        campaignId: id,
      });
      const clientSecret = res.data.clientSecret;

      // 2️⃣ Confirm payment
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) {
        setCardError(error.message);
        return;
      }

      // 3️⃣ Save donation to DB
      if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/save-donation", {
          campaignId: id,
          amount: parseFloat(amount),
          paymentId: paymentIntent.id,
        });

        Swal.fire("Thank You!", "Donation successful!", "success");
        setIsModalOpen(false);
        navigate("/donation-campaigns");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setDonating(false);
    }
  };

  if (!campaign)
    return <p className="text-center py-8 text-red-500">Campaign not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Campaign Details */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
        <img
          src={campaign.imageUrl}
          alt={campaign.petName}
          className="w-full h-72 object-cover"
        />
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2">{campaign.petName}</h2>
          <p className="text-gray-600 mb-2">{campaign.shortDescription}</p>
          <p className="mb-1">
            <strong>Maximum Donation:</strong> ${campaign.maxAmount}
          </p>
          <p className="mb-1">
            <strong>Collected:</strong> $
            {campaign.donators?.reduce((acc, d) => acc + d.amount, 0) || 0}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Donate Now
          </button>
        </div>
      </div>

      {/* Recommended Campaigns */}
      {recommended.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-4">Recommended Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((r) => (
              <div
                key={r._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={r.imageUrl}
                  alt={r.petName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold">{r.petName}</h4>
                  <button
                    onClick={() => navigate(`/donation-details/${r._id}`)}
                    className="mt-3 text-blue-500 underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold mb-4">
              Donate to {campaign.petName}
            </h3>
            <form onSubmit={handleDonate} className="space-y-4">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="w-full border rounded px-3 py-2"
              />
              <CardElement
                className={`p-3 border rounded ${
                  cardError ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => {
                  setCardError(e.error ? e.error.message : "");
                  setCardComplete(e.complete);
                }}
              />
              {cardError && <p className="text-red-500 text-sm">{cardError}</p>}
              <button
                type="submit"
                disabled={donating || !cardComplete}
                className={`w-full px-4 py-2 rounded text-white ${
                  donating || !cardComplete
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {donating ? "Processing..." : "Donate"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
