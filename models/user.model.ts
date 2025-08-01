export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  is_superuser?: boolean;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  is_superuser?: boolean;
  is_active?: boolean;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserSearchParams {
  skip?: number;
  limit?: number;
  search?: string;
} 