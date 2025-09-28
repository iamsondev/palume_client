import React from "react";
import { FaPaw, FaUsers, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const AboutUs = () => {
  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto text-center md:text-left px-4">
        {/* Section Header */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-gray-100 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About Pawlume
        </motion.h2>
        <motion.p
          className="mb-16 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto md:mx-0 leading-relaxed"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Pawlume is a modern pet adoption platform connecting loving people
          with pets in need. Our mission is to simplify adoption, ensure safety,
          and bring joy to both pets and adopters. We collaborate with verified
          shelters and volunteers to give every pet a loving home.
        </motion.p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 flex items-center justify-center mx-auto md:mx-0 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-full mb-6">
              <FaPaw size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Easy Adoption
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Browse pets by category, view detailed profiles, and apply online
              within minutes.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 flex items-center justify-center mx-auto md:mx-0 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-full mb-6">
              <FaUsers size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Trusted Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Connect with verified shelters, volunteers, and pet lovers in your
              area.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-16 h-16 flex items-center justify-center mx-auto md:mx-0 bg-gradient-to-tr from-pink-500 to-red-500 text-white rounded-full mb-6">
              <FaHeart size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Give Love
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Help pets find forever homes and make a meaningful impact in their
              lives.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
