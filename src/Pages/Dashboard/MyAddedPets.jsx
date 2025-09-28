import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../Hook/useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";

const MyAddedPets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [deletePetId, setDeletePetId] = useState(null);

  const { isLoading } = useQuery({
    queryKey: ["my-added-pets", user?.email],
    enabled: !!user && !!axiosSecure,
    queryFn: async () => {
      const res = await axiosSecure.get("/my-added");
      setPets(res.data);
      return res.data;
    },
    onError: (err) => {
      console.error("Failed to fetch pets:", err);
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    },
  });

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, { header: "S/N" }),
      columnHelper.accessor("name", { header: "Pet Name" }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) =>
          typeof info.getValue() === "object"
            ? info.getValue().label
            : info.getValue(),
      }),
      columnHelper.accessor("imageUrl", {
        header: "Image",
        cell: (info) => (
          <img
            src={info.getValue()}
            alt="pet"
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
          />
        ),
      }),
      columnHelper.accessor("adopted", {
        header: "Adoption Status",
        cell: (info) => (info.getValue() ? "Adopted" : "Not Adopted"),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const pet = row.original;
          return (
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-xs sm:text-sm"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-xs sm:text-sm"
                onClick={() => setDeletePetId(pet._id)}
              >
                Delete
              </button>
              {!pet.adopted && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-xs sm:text-sm"
                  onClick={async () => {
                    try {
                      await axiosSecure.patch(`/pets/adopt/${pet._id}`);
                      queryClient.invalidateQueries([
                        "my-added-pets",
                        user?.email,
                      ]);
                      Swal.fire("Success", "Pet marked as adopted", "success");
                    } catch (err) {
                      console.error("Failed to mark adopted:", err);
                      Swal.fire(
                        "Error",
                        err.response?.data?.message || err.message,
                        "error"
                      );
                    }
                  }}
                >
                  Adopted
                </button>
              )}
            </div>
          );
        },
      }),
    ],
    [axiosSecure, navigate, queryClient, user?.email]
  );

  const table = useReactTable({
    data: pets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleDelete = async (petId) => {
    try {
      setPets((prev) => prev.filter((pet) => pet._id !== petId));
      await axiosSecure.delete(`/pets/${petId}`);
      setDeletePetId(null);
      Swal.fire("Deleted", "Pet deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete pet:", err);
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  if (isLoading)
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    );

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        My Added Pets
      </h1>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border p-2 text-xs sm:text-sm cursor-pointer text-gray-800 dark:text-gray-200"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border p-1 sm:p-2 text-xs sm:text-sm text-gray-800 dark:text-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-800 dark:text-gray-200">
                {pet.name}
              </h2>
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Category:</strong>{" "}
              {typeof pet.category === "object"
                ? pet.category.label
                : pet.category}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Status:</strong> {pet.adopted ? "Adopted" : "Not Adopted"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-xs"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-xs"
                onClick={() => setDeletePetId(pet._id)}
              >
                Delete
              </button>
              {!pet.adopted && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-xs"
                  onClick={async () => {
                    try {
                      await axiosSecure.patch(`/pets/adopt/${pet._id}`);
                      queryClient.invalidateQueries([
                        "my-added-pets",
                        user?.email,
                      ]);
                      Swal.fire("Success", "Pet marked as adopted", "success");
                    } catch (err) {
                      console.error("Failed to mark adopted:", err);
                      Swal.fire(
                        "Error",
                        err.response?.data?.message || err.message,
                        "error"
                      );
                    }
                  }}
                >
                  Adopted
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex flex-wrap gap-2 mt-4 items-center text-gray-800 dark:text-gray-200">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded dark:border-gray-600"
          >
            Prev
          </button>
          <span className="text-sm sm:text-base">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded dark:border-gray-600"
          >
            Next
          </button>
        </div>
      )}

      {deletePetId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this pet?
            </p>
            <div className="flex flex-wrap justify-end gap-2 mt-4">
              <button
                onClick={() => setDeletePetId(null)}
                className="px-4 py-2 border rounded dark:border-gray-600 text-gray-800 dark:text-gray-200"
              >
                No
              </button>
              <button
                onClick={() => handleDelete(deletePetId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedPets;
