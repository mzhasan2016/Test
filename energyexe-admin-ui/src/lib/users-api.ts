import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'
import type {
  CreateUserRequest,
  User,
  UpdateUserRequest,
  UsersSearchParams,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types/user'

// User API functions
export const usersApi = {
  getUsers: async (params: UsersSearchParams = {}): Promise<Array<User>> => {
    const searchParams = new URLSearchParams()

    if (params.skip !== undefined) {
      searchParams.append('skip', params.skip.toString())
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    }
    if (params.search) {
      searchParams.append('search', params.search)
    }
    if (params.is_active !== undefined) {
      searchParams.append('is_active', params.is_active.toString())
    }
    if (params.is_superuser !== undefined) {
      searchParams.append('is_superuser', params.is_superuser.toString())
    }

    const query = searchParams.toString()
    const endpoint = query ? `/users/?${query}` : '/users/'

    return apiClient.get<Array<User>>(endpoint)
  },

  getUserById: async (userId: number): Promise<User> => {
    return apiClient.get<User>(`/users/${userId}`)
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/users/me')
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    return apiClient.post<User>('/users/', data)
  },

  updateUser: async (userId: number, data: UpdateUserRequest): Promise<User> => {
    return apiClient.put<User>(`/users/${userId}`, data)
  },

  deleteUser: async (userId: number): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/users/${userId}`)
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', data)
  },

  register: async (data: RegisterRequest): Promise<User> => {
    return apiClient.post<User>('/auth/register', data)
  },
}

// React Query hooks
export const useUsers = (params: UsersSearchParams = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersApi.getCurrentUser(),
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserRequest }) =>
      usersApi.updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      queryClient.setQueryData(['users', 'me'], data.user)
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: usersApi.register,
  })
}