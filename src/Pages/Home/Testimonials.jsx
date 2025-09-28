import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    pet: "Bella (Dog)",
    story:
      "Adopting Bella has changed my life! Pawlume made the process easy and smooth. I can't imagine my home without her.",
    image: "https://i.ibb.co/6R2HyjVt/1.jpg",
  },
  {
    name: "Michael Lee",
    pet: "Whiskers (Cat)",
    story:
      "Thanks to Pawlume, Whiskers found a loving home. The platform is trustworthy and user-friendly.",
    image: "https://i.ibb.co/N2XP3F86/2.jpg",
  },
  {
    name: "Emily Davis",
    pet: "Coco (Rabbit)",
    story:
      "I loved how organized and helpful Pawlume is. Coco is the cutest addition to our family!",
    image: "https://i.ibb.co/chdxxTnp/3.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-12 text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Success Stories
        </motion.h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testi, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <img
                  src={testi.image}
                  alt={testi.pet}
                  className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-pink-500"
                />
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {testi.story}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {testi.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {testi.pet}
                </span>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
