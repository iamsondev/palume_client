import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Select from "react-select";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { Link } from "react-router";

const pageSize = 6;

const PetListing = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["pets", search, category],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axiosSecure.get(
          `/pets?search=${search}&category=${category}&adopted=false&page=${pageParam}&limit=${pageSize}`
        );
        return res.data;
      },
      getNextPageParam: (lastPage) =>
        lastPage?.currentPage < lastPage?.totalPages
          ? lastPage.currentPage + 1
          : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const categories = [
    { value: "", label: "All" },
    { value: "cats", label: "Cats" },
    { value: "dogs", label: "Dogs" },
    { value: "rabbits", label: "Rabbits" },
    { value: "fish", label: "Fish" },
    { value: "birds", label: "Birds" },
  ];

  const allPets = data?.pages?.flatMap((page) => page.pets ?? []) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="Search pets by name..."
          className="border rounded-lg px-4 py-2 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={categories}
          value={categories.find((c) => c.value === category)}
          onChange={(option) => setCategory(option.value)}
          className="w-60"
        />
      </div>

      {/* Pet Grid */}
      {status === "loading" && (
        <p className="text-center text-gray-500">Loading pets...</p>
      )}
      {status === "error" && (
        <p className="text-center text-red-500">Error fetching pets.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={`${pet.image}?w=400&h=300&fit=crop&auto=format,compress`}
              srcSet={`
                ${pet.image}?w=400&h=300&fit=crop&auto=format,compress 400w,
                ${pet.image}?w=600&h=450&fit=crop&auto=format,compress 600w,
                ${pet.image}?w=800&h=600&fit=crop&auto=format,compress 800w
              `}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={pet.name}
              loading="lazy"
              className="h-56 w-full object-cover bg-gray-100"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-1 text-gray-800">
                {pet.name}
              </h3>
              <p className="text-gray-600 mb-1">Age: {pet.age}</p>
              <p className="text-gray-600 mb-2">Location: {pet.location}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                {pet.category}
              </span>
              <p className="text-gray-400 text-sm mb-4">
                Added on: {new Date(pet.createdAt).toLocaleDateString()}
              </p>
              <Link to={`/petDetails/${pet._id}`}>
                <button className="mt-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-10"></div>

      {isFetchingNextPage && (
        <p className="text-center mt-4 text-gray-500">Loading more pets...</p>
      )}
      {!hasNextPage && allPets.length > 0 && (
        <p className="text-center mt-4 text-gray-500">No more pets.</p>
      )}
      {!isFetchingNextPage && allPets.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No pets found.</p>
      )}
    </div>
  );
};

export default PetListing;
