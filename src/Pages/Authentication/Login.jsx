import React from "react";
import { useForm } from "react-hook-form";
import GoogleLogin from "./SocialLogin/GoogleLogin";
import GithubLogin from "./SocialLogin/GithubLogin";
import { useNavigate } from "react-router";
import useAuth from "../../Hook/useAuth";

const Login = () => {
  const {signIn} = useAuth();
  const navigate= useNavigate();
  const {register,handleSubmit, formState:{errors}} = useForm();
  const onSubmit = data => {
    console.log(data);
    signIn(data.email, data.password)
    .then(result=>{
      console.log(result.user)
      navigate("/");
    })
    .catch(error=>{
      console.error(error)
    })
  }
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
        <p className="text-gray-500 mt-2">
          Sign in to continue your journey of finding a loving pet.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', {required:true})}
            id="email"
            placeholder="Enter your email"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
          />
          
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register('password', {required:true, minLength:6})}
            id="password"
            placeholder="Enter your password"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
          />
          {
            errors.password?.type==='required' && <span className="text-red-500">Password is required</span>
          }
          {
            errors.password?.type==='minLength' && <span className="text-red-500">at least 6 letter is required</span>
          }
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-2.5 mt-2 text-white font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:scale-105 transition-transform duration-300"
        >
          Login
        </button>
      </form>
      <GoogleLogin></GoogleLogin>
      <GithubLogin></GithubLogin>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-pink-600 hover:underline font-medium">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;
