import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hook/useAxiosSecure";

const EditDonationCampaign = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch single campaign
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donationCampaigns/${id}`);
      return res.data;
    },
  });

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        setImageUrl(data.data.url);
      } else throw new Error("Image upload failed");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Image upload failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true, // auto-fill previous data
    initialValues: {
      petName: campaign?.petName || "",
      maxAmount: campaign?.maxAmount || "",
      lastDate: campaign?.lastDate ? campaign.lastDate.slice(0, 10) : "",
      shortDescription: campaign?.shortDescription || "",
      longDescription: campaign?.longDescription || "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.petName) errors.petName = "Pet Name is required";
      if (!values.maxAmount) errors.maxAmount = "Max amount is required";
      if (!values.lastDate) errors.lastDate = "Last date is required";
      if (!values.shortDescription) errors.shortDescription = "Required";
      if (!values.longDescription) errors.longDescription = "Required";
      if (!imageUrl && !campaign?.imageUrl) errors.image = "Image is required";
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          imageUrl: imageUrl || campaign?.imageUrl,
        };

        await axiosSecure.patch(`/donationCampaigns/${id}`, payload);
        Swal.fire("Success", "Donation campaign updated!", "success");
        queryClient.invalidateQueries(["myCampaigns"]);
        navigate("/dashboard/my-donation-campaign");
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Server error",
          "error"
        );
      }
    },
  });

  if (isLoading) return <p>Loading campaign...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Edit Donation Campaign
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Pet Name */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Pet Name
          </label>
          <input
            type="text"
            name="petName"
            value={formik.values.petName}
            onChange={formik.handleChange}
            className="w-full p-2 border rounded"
          />
          {formik.errors.petName && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.petName}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Pet Image
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          {loading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {formik.errors.image && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.image}</p>
          )}
          <img
            src={imageUrl || campaign?.imageUrl}
            alt="Uploaded"
            className="mt-2 w-48 h-48 object-cover rounded"
            loading="lazy"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Maximum Amount
          </label>
          <input
            type="number"
            name="maxAmount"
            onChange={formik.handleChange}
            value={formik.values.maxAmount}
            className="w-full p-2 border rounded"
          />
          {formik.errors.maxAmount && (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.maxAmount}
            </p>
          )}
        </div>

        {/* Last Date */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Last Date
          </label>
          <input
            type="date"
            name="lastDate"
            onChange={formik.handleChange}
            value={formik.values.lastDate}
            className="w-full p-2 border rounded"
          />
          {formik.errors.lastDate && (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.lastDate}
            </p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Short Description
          </label>
          <input
            type="text"
            name="shortDescription"
            onChange={formik.handleChange}
            value={formik.values.shortDescription}
            className="w-full p-2 border rounded"
          />
          {formik.errors.shortDescription && (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.shortDescription}
            </p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Long Description
          </label>
          <textarea
            name="longDescription"
            onChange={formik.handleChange}
            value={formik.values.longDescription}
            className="w-full p-2 border rounded h-32"
          />
          {formik.errors.longDescription && (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.longDescription}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Update Campaign"}
        </button>
      </form>
    </div>
  );
};

export default EditDonationCampaign;
