import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook for fetching data using React Query.
 * This hook handles caching data fetched by the service (default cache time 5 mins).
 * @function useFetch
 * @param {Function} service - The service to fetch data from.
 * @param {Array} dependencies - The dependencies to trigger the fetch on changes.
 * @param {Object} params - The query parameters for the request.
 * @returns {Object} An object containing loading and fetched data information.
 */
export const useFetch = (service, name, dependencies = [], params = {}) => {
  /**
   * Fetch data from the provided URL using axios.
   * @function fetchData
   * @returns {Promise} The fetched data.
   */
  const fetchData = async () => {
    try {
      if (!service) {
        return null; // No request should be made when there is no url
      }

      const response = await service(params);

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Define the query key for caching purposes
  const queryKey = ["data", name, params];

  // Use the useQuery hook to manage fetching and caching
  const { isLoading, isFetching, isError, data, refetch } = useQuery({ queryKey, queryFn: fetchData });

  // Trigger the refetch when dependencies change
  useEffect(() => {
    refetch();
  }, dependencies);

  // Return loading and fetched data information
  return { isLoading, isFetching, isError, data, refetch };
};
