import React, { useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook/useAuth";

const categories = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "fish", label: "Fish" },
];

const AddAPet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      if (data.success) setImageUrl(data.data.url);
      else throw new Error("Image upload failed");
    } catch (err) {
      console.error("Image upload error:", err);
      Swal.fire("Error", "Image upload failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      category: null,
      location: "",
      shortDescription: "",
      longDescription: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Pet name required";
      if (!values.age) errors.age = "Pet age required";
      if (!values.category) errors.category = "Category required";
      if (!values.location) errors.location = "Location required";
      if (!values.shortDescription) errors.shortDescription = "Required";
      if (!values.longDescription) errors.longDescription = "Required";
      if (!imageUrl) errors.image = "Pet image required";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      if (!axiosSecure) {
        Swal.fire(
          "Session expired",
          "Please login again to continue.",
          "warning"
        ).then(() => navigate("/login"));
        return;
      }

      try {
        const petData = {
          name: values.name,
          age: values.age,
          category: values.category.value,
          location: values.location,
          shortDescription: values.shortDescription,
          longDescription: values.longDescription,
          imageUrl,
          adopted: false,
          ownerEmail: user.email, // ✅ same as backend expects
        };
        await axiosSecure.post("/pets", petData);

        Swal.fire("Success", "Pet added successfully!", "success");
        resetForm();
        setImageUrl("");
        navigate("/dashboard/my-pets");
      } catch (err) {
        console.error("Error adding pet:", err);
        if (err.response?.status === 401) {
          Swal.fire("Session expired", "Please login again", "warning").then(
            () => navigate("/login")
          );
        } else {
          Swal.fire("Error", "Failed to add pet!", "error");
        }
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Add a Pet
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Pet Image */}
        <div>
          <label className="block mb-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
            Pet Image
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />
          {loading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {formik.errors.image && (
            <p className="mt-1 text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
              {formik.errors.image}
            </p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Pet"
              className="mt-3 w-48 h-48 object-cover rounded-xl shadow"
            />
          )}
        </div>

        {/* Pet Name */}
        <div>
          <label className="block mb-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
            Pet Name
          </label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />
          {formik.errors.name && (
            <p className="mt-1 text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
              {formik.errors.name}
            </p>
          )}
        </div>

        {/* Pet Age */}
        <div>
          <label className="block mb-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
            Pet Age
          </label>
          <input
            type="text"
            name="age"
            onChange={formik.handleChange}
            value={formik.values.age}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />
          {formik.errors.age && (
            <p className="mt-1 text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
              {formik.errors.age}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
            Category
          </label>
          <Select
            options={categories}
            value={formik.values.category}
            onChange={(value) => formik.setFieldValue("category", value)}
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {formik.errors.category && (
            <p className="mt-1 text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
              {formik.errors.category}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block mb-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
            Location
          </label>
          <input
            type="text"
            name="location"
            onChange={formik.handleChange}
            value={formik.values.location}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />
          {formik.errors.location && (
            <p className="mt-1 text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
              {formik.errors.location}
            </p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block mb-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
            Short Description
          </label>
          <input
            type="text"
            name="shortDescription"
            onChange={formik.handleChange}
            value={formik.values.shortDescription}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />
          {formik.errors.shortDescription && (
            <p className="mt-1 text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
              {formik.errors.shortDescription}
            </p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block mb-2 text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
            Long Description
          </label>
          <textarea
            name="longDescription"
            onChange={formik.handleChange}
            value={formik.values.longDescription}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 h-40 resize-none"
          />
          {formik.errors.longDescription && (
            <p className="mt-1 text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
              {formik.errors.longDescription}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !axiosSecure}
          className={`w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all ${
            loading || !axiosSecure ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

export default AddAPet;
