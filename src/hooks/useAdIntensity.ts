import { useQuery } from "@tanstack/react-query";

interface AdIntensityResponse {
  level: number;
  description: string;
  enabled: boolean;
}

async function fetchAdIntensity(): Promise<AdIntensityResponse> {
  const response = await fetch("/api/settings/public/ad-intensity");
  
  if (!response.ok) {
    // Return default if fetch fails
    return { level: 3, description: "Standard", enabled: true };
  }
  
  return response.json();
}

export function useAdIntensity() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ad-intensity"],
    queryFn: fetchAdIntensity,
    staleTime: 0, // No stale time - always fetch fresh data
    refetchInterval: 30000, // Refetch every 30 seconds to ensure sync
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when connection is restored
    retry: 1,
  });

  return {
    level: data?.level ?? 3,
    description: data?.description ?? "Standard",
    enabled: data?.enabled ?? true,
    isLoading,
    error,
  };
}
