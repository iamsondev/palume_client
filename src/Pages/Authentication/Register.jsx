import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useAuth from "../../Hook/useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import GoogleLogin from "./SocialLogin/GoogleLogin";
import GithubLogin from "./SocialLogin/GithubLogin";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Separate image upload function
  const handleImageUpload = async (file) => {
    if (!file) return null;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?expiration=600&key=${
          import.meta.env.VITE_image_upload_key
        }`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) return data.data.url;
      throw new Error("Image upload failed");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Image upload failed!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await createUser(data.email, data.password);
      const user = result.user;

      let photoURL = "";
      if (selectedImage) {
        photoURL = await handleImageUpload(selectedImage);
      }

      await updateProfile(user, { displayName: data.fullName, photoURL });

      await axiosSecure.post("/users", {
        name: data.fullName,
        email: data.email,
        role: "user",
        photoURL,
      });

      Swal.fire("Success!", "Registration successful!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-100 dark:from-gray-900">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Full Name
              </label>
              <input
                type="text"
                {...formRegister("fullName", {
                  required: "Full name is required",
                })}
                placeholder="John Doe"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 outline-none transition"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                {...formRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="example@mail.com"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 outline-none transition"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                {...formRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter password"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 outline-none transition"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="mt-2 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-emerald-600 file:text-white hover:file:bg-emerald-800 transition"
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
              disabled={loading}
              className="w-full py-3 mt-3 text-white font-bold rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 hover:scale-105 transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <GoogleLogin />
          <GithubLogin />

          <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-6">
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
