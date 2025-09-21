import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useAuth from "../../Hook/useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import GoogleLogin from "./SocialLogin/GoogleLogin";
import GithubLogin from "./SocialLogin/GithubLogin";
import axios from "axios";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  const handleImageUpload = async (file) => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=600&key=${
          import.meta.env.VITE_image_upload_key
        }`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Image Upload Error:", error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await createUser(data.email, data.password);
      const user = result.user;

      // 1️⃣ Upload profile image if selected
      let photoURL = "";
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?expiration=600&key=${
            import.meta.env.VITE_image_upload_key
          }`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        photoURL = res.data.data.url;
      }

      // 2️⃣ Update Firebase profile
      await updateProfile(user, {
        displayName: data.fullName,
        photoURL,
      });

      // 3️⃣ Send user data to MongoDB
      await axiosSecure.post("/users", {
        name: data.fullName,
        email: data.email,
        role: "user",
        photoURL,
      });

      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                placeholder="John Doe"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="example@mail.com"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter password"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-pink-500 file:text-white hover:file:bg-pink-600 transition"
              />
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="mt-3 w-20 h-20 object-cover rounded-full border"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-3 text-white font-bold rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:scale-105 transition-transform duration-300"
            >
              Register
            </button>
          </form>

          <GoogleLogin />
          <GithubLogin />

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-pink-600 hover:underline font-medium"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
