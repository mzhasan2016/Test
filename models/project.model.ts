export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled';

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: ProjectStatus;
  budget?: number;
  start_date?: Date;
  end_date?: Date;
  owner_id: number;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  budget?: number;
  start_date?: Date;
  end_date?: Date;
  owner_id?: number;
}

export interface ProjectSearchParams {
  skip?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  owner_id?: number;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  budget?: number;
  start_date?: Date;
  end_date?: Date;
  owner_id: number;
  owner?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  on_hold: number;
  cancelled: number;
}