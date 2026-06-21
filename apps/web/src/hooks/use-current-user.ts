import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../http/get-profile";

export function useCurrentUser() {
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
  });

  return data?.user;
}
