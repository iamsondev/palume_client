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
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return { role: "guest" };
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email && !authLoading,
    staleTime: 1000 * 60 * 10, // 10 মিনিট cache
    cacheTime: 1000 * 60 * 30, // 30 মিনিট cache
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    role: roleLoading ? null : roleData?.role || "guest",
    roleLoading,
    isError,
    error,
  };
};

export default useUserRole;
