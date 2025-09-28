import React from "react";
import { Link } from "react-router";
import { FaCat, FaDog, FaFish, FaCrow } from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const categories = [
  { name: "Cats", icon: FaCat, link: "/pets?category=cats" },
  { name: "Dogs", icon: FaDog, link: "/pets?category=dogs" },
  { name: "Rabbits", icon: GiRabbit, link: "/pets?category=rabbits" },
  { name: "Fish", icon: FaFish, link: "/pets?category=fish" },
  { name: "Birds", icon: FaCrow, link: "/pets?category=birds" },
];

const PetCategories = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-10">
          Explore Pet Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={cat.link}
                  className="flex flex-col items-center w-full gap-4 group"
                >
                  <motion.div
                    className="p-6 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 text-white shadow-xl flex items-center justify-center"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      scale: 1.2,
                      transition: { duration: 0.6 },
                    }}
                  >
                    <IconComponent className="text-4xl" />
                  </motion.div>

                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-300">
                    {cat.name}
                  </h3>

                  <Button
                    variant="outline"
                    className="mt-2 w-full py-2 text-sm font-medium group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-blue-500 group-hover:text-white transition-all duration-300"
                  >
                    View
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PetCategories;
