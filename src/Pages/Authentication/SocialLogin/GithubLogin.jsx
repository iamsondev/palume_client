import React from "react";
import { FaGithub } from "react-icons/fa";
import useAuth from "../../../Hook/useAuth";

const GithubLogin = ({  text }) => {
  const {signInWithGithub}= useAuth();
  const handleGithubSignIn =()=>{
    signInWithGithub()
    .then(result=>{
      console.log(result.user)
    })
    .catch(error=>{
      console.error(error)
    })
  }
  return (
    <div className="flex justify-center">
      <button
        onClick={handleGithubSignIn} // Callback function for GitHub login
        className="flex items-center justify-center w-full max-w-md px-4 py-3 border border-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300 bg-gray-900 text-white font-semibold hover:bg-gray-800"
      >
        <FaGithub size={24} className="mr-3" />
        {text || "Continue with GitHub"}
      </button>
    </div>
  );
};

export default GithubLogin;
