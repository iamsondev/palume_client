import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const slides = [
  {
    title: "Find Your Furry Friend",
    subtitle: "Adopt a pet today and bring happiness home.",
    image: "https://i.ibb.co/6R2HyjVt/1.jpg",
    link: "/pets",
  },
  {
    title: "Give a Pet a Second Chance",
    subtitle: "Support rescued animals and help them find a loving home.",
    image: "https://i.ibb.co/N2XP3F86/2.jpg",
    link: "/donations",
  },
  {
    title: "Connect with Animal Lovers",
    subtitle: "Join our community to share stories and adoption tips.",
    image: "https://i.ibb.co/chdxxTnp/3.jpg",
    link: "/community",
  },
];

// Duplicate slides if length is less than 3 (loop-safe)
const slidesForLoop = slides.length < 3 ? [...slides, ...slides] : slides;

const Banner = () => {
  return (
    <section>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slidesForLoop.length > 1} // loop only if enough slides
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
      >
        {slidesForLoop.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="bg-black/50 p-8 rounded text-center text-white max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="mb-6 text-lg md:text-xl">{slide.subtitle}</p>
                <Button asChild>
                  <Link to={slide.link}>Learn More</Link>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
