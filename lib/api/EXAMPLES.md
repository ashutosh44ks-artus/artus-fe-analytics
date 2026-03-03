// Example usage of the API client and hooks

import { useApiQuery, useApiMutation, apiClient } from '@/lib/api';

// Example interface for API responses
interface User {
  id: string;
  name: string;
  email: string;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
}

// Example 1: Using GET query
export function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useApiQuery<User>(
    ['user', userId],
    `/users/${userId}`
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}

// Example 2: Using mutation with custom mutationFn
export function UpdateUserForm({ userId }: { userId: string }) {
  const { mutate: updateUser, isPending } = useApiMutation<
    User,
    UpdateUserPayload
  >(
    (data) => apiClient.post<User>(`/users/${userId}`, data),
    {
      onSuccess: (data) => {
        console.log('User updated:', data);
      },
      onError: (error) => {
        console.error('Failed to update user:', error);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateUser({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
}

// Available hooks:
// - useApiQuery<T>(queryKey, url, options)
// - useApiMutation<TData, TVariables>(mutationFn, options)
//
// Available client methods:
// - apiClient.get<T>(url)
// - apiClient.post<T>(url, data)
// - apiClient.put<T>(url, data)
// - apiClient.patch<T>(url, data)
// - apiClient.delete<T>(url)
//
// Configure API_BASE_URL via NEXT_PUBLIC_API_URL environment variable
