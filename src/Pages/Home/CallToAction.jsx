import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const CallToAction = () => {
  const navigate = useNavigate();

  const images = [
    "https://i.ibb.co/d0NC19LL/5.jpg", // Dog
    "https://i.ibb.co/N2XP3F86/2.jpg", // Cat
    "https://i.ibb.co/chdxxTnp/3.jpg", // Rabbit
    "https://i.ibb.co/352SK1zz/9.jpg", // Bird
  ];

  return (
    <section className="relative bg-gradient-to-r from-pink-50 via-white to-blue-50 py-20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side - Image Grid */}
        <motion.div
          className="w-full md:w-1/2 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {images.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt={`Pet Category ${index + 1}`}
              className="rounded-xl shadow-lg object-cover h-48 w-full hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
            />
          ))}
        </motion.div>

        {/* Right Side - Text */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* MODERN HEADLINE */}
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
            Adopt Love, Change a Life 🐾
          </h2>

          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            From playful dogs to cuddly cats, curious rabbits to cheerful birds —
            every pet is waiting for a loving home.
            <span className="block mt-2 italic text-gray-600">
              “Adopting a pet may not change the whole world, but for that one pet,
              their entire world will change.”
            </span>
          </p>

          <ul className="mt-6 text-left text-gray-800 space-y-2">
            <li>✅ Give abandoned animals a second chance</li>
            <li>✅ Build a bond of love & trust</li>
            <li>✅ Make a difference with one small step</li>
          </ul>

          <Button
            className="mt-6 px-6 py-3 text-lg rounded-xl shadow-md hover:shadow-xl transition-all"
            onClick={() => navigate("/pet-listing")}
          >
            Find Your Perfect Pet ❤️
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
