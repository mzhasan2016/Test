export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  middle_name?: string  // Added middle name field
  last_name?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  first_name?: string
  middle_name?: string  // Added middle name field
  last_name?: string
  is_superuser?: boolean
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  first_name?: string
  middle_name?: string  // Added middle name field
  last_name?: string
  is_superuser?: boolean
}

export interface UsersSearchParams {
  skip?: number
  limit?: number
  search?: string
  is_active?: boolean
  is_superuser?: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  first_name?: string
  middle_name?: string  // Added middle name field
  last_name?: string
}