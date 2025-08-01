export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled'

export interface Project {
  id: number
  name: string
  description?: string
  status: ProjectStatus
  budget?: number
  start_date?: string
  end_date?: string
  owner_id: number
  owner?: {
    id: number
    username: string
    email: string
    first_name?: string
    middle_name?: string  // Added middle name field
    last_name?: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  status: ProjectStatus
  budget?: number
  start_date?: string
  end_date?: string
  owner_id: number
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  status?: ProjectStatus
  budget?: number
  start_date?: string
  end_date?: string
  owner_id?: number
}

export interface ProjectsSearchParams {
  skip?: number
  limit?: number
  search?: string
  status?: ProjectStatus
  owner_id?: number
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  on_hold: 'On Hold',
  cancelled: 'Cancelled',
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
}