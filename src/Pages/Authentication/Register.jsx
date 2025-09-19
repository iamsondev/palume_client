import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router"; // ✅ import useNavigate
import useAuth from "../../Hook/useAuth";
import GoogleLogin from "./SocialLogin/GoogleLogin";
import GithubLogin from "./SocialLogin/GithubLogin";

const Register = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { createUser } = useAuth();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        // ✅ Navigate to home page after successful registration
        navigate("/"); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                placeholder="John Doe"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })}
                placeholder="example@mail.com"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="Enter password"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 mt-3 text-white font-bold rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:scale-105 transition-transform duration-300"
            >
              Register
            </button>
          </form>

          {/* Social Login */}
          <GoogleLogin />
          <GithubLogin />

          {/* Footer */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-pink-600 hover:underline font-medium">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
