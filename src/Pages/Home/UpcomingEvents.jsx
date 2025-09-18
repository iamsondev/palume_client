import React from "react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const events = [
  {
    title: "Adoption Drive at Central Park",
    date: "Sep 25, 2025",
    description: "Join us to meet adorable pets ready for adoption.",
    image: "https://i.ibb.co/chdxxTnp/3.jpg",
    link: "/events/adoption-drive",
  },
  {
    title: "Pet Vaccination Camp",
    date: "Oct 10, 2025",
    description: "Free vaccination for pets organized by Pawlume volunteers.",
    image: "https://i.ibb.co/0pLRq2y2/4.jpg",
    link: "/events/vaccination-camp",
  },
  {
    title: "Fundraising Campaign",
    date: "Oct 20, 2025",
    description: "Support rescued animals by donating to our campaigns.",
    image: "https://i.ibb.co/d0NC19LL/5.jpg",
    link: "/donations",
  },
];

const UpcomingEvents = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-gray-900">
          Upcoming Events & Campaigns
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {events.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}
                ></div>
                <div className="p-6 text-left">
                  <p className="text-sm text-gray-400 mb-2">{event.date}</p>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Button asChild variant="outline">
                    <a href={event.link}>Learn More</a>
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default UpcomingEvents;
