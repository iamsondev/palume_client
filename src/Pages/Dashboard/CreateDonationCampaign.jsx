import React, { useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook/useAuth";
import { useNavigate } from "react-router";

const CreateDonationCampaign = () => {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);

    // Compress image
    const compressImage = (file, maxWidth = 800, maxHeight = 800) =>
      new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (event) => {
          img.src = event.target.result;
        };
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob), file.type, 0.7); // quality 70%
        };
        reader.readAsDataURL(file);
      });

    try {
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append("image", compressedFile);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        Swal.fire("Success", "Image uploaded successfully!", "success");
      } else throw new Error("Image upload failed");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Image upload failed!", "error");
    } finally {
      setImageUploading(false);
    }
  };

  // Formik
  const formik = useFormik({
    initialValues: {
      petName: "",
      maxAmount: "",
      lastDate: "",
      shortDescription: "",
      longDescription: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.petName) errors.petName = "Pet name is required";
      if (!values.maxAmount) errors.maxAmount = "Max amount is required";
      if (!values.lastDate) errors.lastDate = "Last date is required";
      if (!values.shortDescription) errors.shortDescription = "Required";
      if (!values.longDescription) errors.longDescription = "Required";
      if (!imageUrl) errors.image = "Image is required";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      setFormSubmitting(true);

      try {
        const payload = { ...values, imageUrl, ownerEmail: user?.email };
        const res = await axiosSecure.post(
          "/donationCampaigns/create",
          payload
        );

        if (res.data?.campaignId) {
          Swal.fire("Success", "Donation campaign created!", "success");
          resetForm();
          setImageUrl("");
          navigate("/dashboard/my-donation-campaign");
        }
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Server error",
          "error"
        );
      } finally {
        setFormSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Create Donation Campaign
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          {imageUploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
          )}
          {formik.errors.image && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.image}</p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              loading="lazy"
              className="mt-2 w-48 h-48 object-cover rounded"
            />
          )}
        </div>

        {/* Pet Name */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Pet Name
          </label>
          <input
            type="text"
            name="petName"
            onChange={formik.handleChange}
            value={formik.values.petName}
            className="w-full p-2 border rounded"
          />
          {formik.errors.petName && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.petName}</p>
          )}
        </div>

        {/* Maximum Amount */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formSubmitting || imageUploading}
          className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          {formSubmitting
            ? "Submitting..."
            : imageUploading
            ? "Uploading image..."
            : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateDonationCampaign;
