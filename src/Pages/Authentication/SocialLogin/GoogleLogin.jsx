import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = ({ onSuccess, onFailure, text }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onSuccess} // Replace with actual Google Sign-In function
        className="flex items-center justify-center w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition duration-300 bg-white text-gray-700 font-semibold hover:bg-gray-50"
      >
        <FcGoogle size={24} className="mr-3" />
        {text || "Continue with Google"}
      </button>
    </div>
  );
};

export default GoogleLogin;
