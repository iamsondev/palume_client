import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData,
    isLoading: roleLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email && !authLoading,
  });

  return {
    role: roleLoading ? null : roleData?.role || "guest",
    roleLoading,
    isError,
    error,
    refetch,
  };
};

export default useUserRole;
