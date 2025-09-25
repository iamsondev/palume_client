import React from "react";
import { Link } from "react-router";
import { FaCat, FaDog, FaFish, FaCrow } from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Cats",
    icon: <FaCat className="text-3xl text-primary" />,
    link: "/pets?category=cats",
  },
  {
    name: "Dogs",
    icon: <FaDog className="text-3xl text-primary" />,
    link: "/pets?category=dogs",
  },
  {
    name: "Rabbits",
    icon: <GiRabbit className="text-3xl text-primary" />,
    link: "/pets?category=rabbits",
  },
  {
    name: "Fish",
    icon: <FaFish className="text-3xl text-primary" />,
    link: "/pets?category=fish",
  },
  {
    name: "Birds",
    icon: <FaCrow className="text-3xl text-primary" />,
    link: "/pets?category=birds",
  },
];

const PetCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10">
          Explore Pet Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <Link
              to={cat.link}
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3 group"
            >
              <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary">
                {cat.name}
              </h3>
              <Button
                variant="outline"
                className="mt-2 group-hover:bg-primary group-hover:text-white"
              >
                View
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetCategories;
