import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../Hook/useAuth";
import { useNavigate } from "react-router";

const GoogleLogin = ({ text = "Continue with Google" }) => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(result => {
        console.log(result.user);
        navigate('/');
      })
      .catch(error => {
        console.error(error);
        
      });
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition duration-300 bg-white text-gray-700 font-semibold hover:bg-gray-50"
      >
        <FcGoogle size={24} className="mr-3" />
        {text}
      </button>
    </div>
  );
};

export default GoogleLogin;
