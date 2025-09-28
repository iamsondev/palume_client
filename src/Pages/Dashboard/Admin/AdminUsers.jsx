import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

const AdminUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Load all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  // 🔑 Make Admin
  const handleMakeAdmin = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to promote this user to Admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make admin!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/users/make-admin/${id}`);
      if (res.data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, role: "admin" } : user
          )
        );
        Swal.fire("Success", "User promoted to admin!", "success");
      } else {
        Swal.fire("Info", "No changes made.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  // 🚫 Ban / Unban User
  const handleToggleBan = async (id, currentStatus) => {
    const action = currentStatus ? "unban" : "ban";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: currentStatus
        ? "This will unban the user."
        : "This will ban the user permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#3085d6" : "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: currentStatus ? "Yes, unban!" : "Yes, ban!",
    });

    if (!confirm.isConfirmed) return;

    const prevUsers = [...users];
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, banned: !currentStatus } : user
      )
    );

    try {
      const res = await axiosSecure.patch(`/users/${action}/${id}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire(
          currentStatus ? "Unbanned!" : "Banned!",
          `User has been ${action}ned.`,
          "success"
        );
      } else {
        throw new Error("No modification");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", `Failed to ${action} user`, "error");
      setUsers(prevUsers); // rollback
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (users.length === 0)
    return (
      <p className="p-4 text-gray-800 dark:text-gray-200">No users found.</p>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        All Users
      </h2>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="table w-full border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td>
                  <img
                    src={
                      user.photoURL && user.photoURL !== ""
                        ? user.photoURL
                        : "https://i.ibb.co/7nV0yV8/default-avatar.png"
                    }
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>{user.name || "Unknown"}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.role || "user"}</td>
                <td>
                  {user.banned ? (
                    <span className="text-red-500 font-medium">Banned</span>
                  ) : (
                    <span className="text-green-500 font-medium">Active</span>
                  )}
                </td>
                <td className="flex gap-2 flex-wrap">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Make Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleBan(user._id, user.banned)}
                    className={`px-3 py-1 text-white rounded ${
                      user.banned
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {user.banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                {user.name || "Unknown"}
              </h3>
              <img
                src={
                  user.photoURL && user.photoURL !== ""
                    ? user.photoURL
                    : "https://i.ibb.co/7nV0yV8/default-avatar.png"
                }
                alt={user.name || "User"}
                className="w-12 h-12 rounded-full"
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Role:</strong> {user.role || "user"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Status:</strong>{" "}
              {user.banned ? (
                <span className="text-red-500 font-medium">Banned</span>
              ) : (
                <span className="text-green-500 font-medium">Active</span>
              )}
            </p>
            <div className="flex gap-2 flex-wrap">
              {user.role !== "admin" && (
                <button
                  onClick={() => handleMakeAdmin(user._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Make Admin
                </button>
              )}
              <button
                onClick={() => handleToggleBan(user._id, user.banned)}
                className={`px-3 py-1 text-white rounded ${
                  user.banned
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {user.banned ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
