// MyAddedPets.jsx
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

  // Fetch user's pets
  const { isLoading } = useQuery({
    queryKey: ["my-added-pets", user?.email],
    enabled: !!user && !!axiosSecure,
    queryFn: async () => {
      const res = await axiosSecure.get("/my-added");
      setPets(res.data); // Save in local state
      return res.data;
    },
    onError: (err) => {
      console.error("Failed to fetch pets:", err);
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    },
  });

  // Table columns
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        header: "S/N",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", { header: "Pet Name" }),
      columnHelper.accessor("category", { header: "Category" }),
      columnHelper.accessor("imageUrl", {
        header: "Image",
        cell: (info) => (
          <img
            src={info.getValue()}
            alt="pet"
            className="w-16 h-16 object-cover rounded"
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
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => setDeletePetId(pet._id)}
              >
                Delete
              </button>
              {!pet.adopted && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
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

  // Initialize table
  const table = useReactTable({
    data: pets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // Delete handler
  const handleDelete = async (petId) => {
    try {
      // 1️⃣ Immediately remove from local state
      setPets((prev) => prev.filter((pet) => pet._id !== petId));

      // 2️⃣ Call delete API
      await axiosSecure.delete(`/pets/${petId}`);

      // 3️⃣ Close modal
      setDeletePetId(null);

      Swal.fire("Deleted", "Pet deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete pet:", err);
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  if (isLoading) return <p>Loading pets...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Added Pets</h1>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border p-2 cursor-pointer"
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
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex gap-2 mt-4 items-center">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded"
          >
            Prev
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {deletePetId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this pet?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setDeletePetId(null)}
                className="px-4 py-2 border rounded"
              >
                No
              </button>
              <button
                onClick={() => handleDelete(deletePetId)}
                className="px-4 py-2 bg-red-500 text-white rounded"
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
