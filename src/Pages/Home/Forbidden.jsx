import { Link } from "react-router";
import { Ban } from "lucide-react";

const Forbidden = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center p-4">
      <Ban className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-2xl shadow-md transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Forbidden;
