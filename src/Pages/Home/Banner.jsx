import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";
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
  {
    title: "Foster a Pet",
    subtitle: "Provide temporary care and help pets transition to forever homes.",
    image: "https://i.ibb.co/0pLRq2y2/4.jpg",
    link: "/pets",
  },
  {
    title: "Volunteer for Pets",
    subtitle: "Help animals locally and make a real impact.",
    image: "https://i.ibb.co/d0NC19LL/5.jpg",
    link: "/volunteer",
  },
  {
    title: "Pet Care Tips",
    subtitle: "Learn how to keep your pets healthy and happy.",
    image: "https://i.ibb.co/FkDLWtFT/6.jpg",
    link: "/blog",
  },
  {
    title: "Attend Pet Events",
    subtitle: "Participate in adoption fairs and pet activities.",
    image: "https://i.ibb.co/Fddt5Tb/7.jpg",
    link: "/events",
  },
  {
    title: "Donate and Save Lives",
    subtitle: "Support campaigns to rescue and feed pets in need.",
    image: "https://i.ibb.co/352SK1zz/9.jpg",
    link: "/donations",
  },
  {
    title: "Adopt Cats",
    subtitle: "Give adorable cats a loving forever home.",
    image: "https://i.ibb.co/NnCSNNk4/8.jpg",
    link: "/pets",
  },
  {
    title: "Adopt Dogs",
    subtitle: "Find loyal canine companions waiting for you.",
    image: "https://i.ibb.co/207CX3g0/10.jpg",
    link: "/pets",
  },
];

const Banner = () => {
  return (
    <section>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="bg-black/50 p-8 rounded text-center text-white max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
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
