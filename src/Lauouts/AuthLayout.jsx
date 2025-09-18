import React from "react";
import { Outlet, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Auth Form + Mobile Image */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-6">
        {/* Mobile Image */}
        <div className="block md:hidden mb-6 w-full max-w-xs">
          <img
            src="https://i.ibb.co.com/67ZR836C/Wavy-Gen-01-Single-07.jpg"
            alt="Pet Adoption"
            className="rounded-xl shadow-lg object-cover w-full h-44"
          />
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <Outlet />
        </div>
      </div>

      {/* Right Side - Desktop Image Section */}
      <div className="relative hidden md:flex flex-1 items-center justify-center p-8">
        <div className="relative w-full max-w-2xl">
          {/* Adjusted Image Size */}
          <img
            src="https://i.ibb.co.com/67ZR836C/Wavy-Gen-01-Single-07.jpg"
            alt="Pet Adoption"
            className="w-full h-[70vh] object-cover rounded-2xl shadow-2xl"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-2xl p-6 text-center">
            <h2 className="text-4xl font-extrabold text-white drop-shadow-md">
              Adopt Love, Give Hope 🐾
            </h2>
            <p className="mt-4 text-lg text-gray-200 max-w-md leading-relaxed">
              Every pet deserves a second chance. Be the reason they wag their tail again.
            </p>
            <Button
              onClick={() => navigate("/pet-listing")}
              className="mt-6 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-pink-500 to-yellow-400 text-white hover:scale-105 transition-transform duration-300"
            >
              Explore Pets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
