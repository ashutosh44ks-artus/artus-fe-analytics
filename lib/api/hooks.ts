import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';
import { apiClient } from './client';
import { AxiosError } from 'axios';

// Generic GET query hook
export function useApiQuery<T>(
  queryKey: QueryKey,
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError>({
    queryKey,
    queryFn: () => apiClient.get<T>(url),
    ...options,
  });
}

// Generic mutation hook
export function useApiMutation<TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, AxiosError, TVariables>,
    'mutationFn'
  >
) {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn,
    ...options,
  });
}
