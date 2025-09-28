import React from "react";
import { useForm } from "react-hook-form";
import GoogleLogin from "./SocialLogin/GoogleLogin";
import GithubLogin from "./SocialLogin/GithubLogin";
import { useNavigate } from "react-router";
import useAuth from "../../Hook/useAuth";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Sign in to continue your journey of finding a loving pet.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            id="email"
            placeholder="Enter your email"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg
                       bg-gray-50 dark:bg-gray-800 dark:text-white
                       focus:ring-emerald-500 focus:border-emerald-500-300 outline-none transition"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            id="password"
            placeholder="Enter your password"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg
                       bg-gray-50 dark:bg-gray-800 dark:text-white
                       focus:ring-emerald-500 focus:border-emerald-600 outline-none transition"
          />
          {errors.password?.type === "required" && (
            <span className="text-red-500">Password is required</span>
          )}
          {errors.password?.type === "minLength" && (
            <span className="text-red-500">
              At least 6 letters are required
            </span>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-2.5 mt-2 text-white font-semibold rounded-xl 
                     bg-gradient-to-r from-emerald-500 to-yellow-300 
                     hover:scale-105 transition-transform duration-300"
        >
          Login
        </button>
      </form>

      {/* Social Login */}
      <div className="mt-4 space-y-2">
        <GoogleLogin />
        <GithubLogin />
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-4">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-pink-600 dark:text-pink-400 hover:underline font-medium"
        >
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;
