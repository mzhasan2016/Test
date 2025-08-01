import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'
import type {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
  ProjectsSearchParams,
} from '../types/project'

// Project API functions
export const projectsApi = {
  getProjects: async (params: ProjectsSearchParams = {}): Promise<Array<Project>> => {
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
    if (params.status) {
      searchParams.append('status', params.status)
    }
    if (params.owner_id !== undefined) {
      searchParams.append('owner_id', params.owner_id.toString())
    }

    const query = searchParams.toString()
    const endpoint = query ? `/projects/?${query}` : '/projects/'

    return apiClient.get<Array<Project>>(endpoint)
  },

  getProjectById: async (projectId: number): Promise<Project> => {
    return apiClient.get<Project>(`/projects/${projectId}`)
  },

  getMyProjects: async (): Promise<Array<Project>> => {
    return apiClient.get<Array<Project>>('/projects/my/projects')
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    return apiClient.post<Project>('/projects/', data)
  },

  updateProject: async (projectId: number, data: UpdateProjectRequest): Promise<Project> => {
    return apiClient.put<Project>(`/projects/${projectId}`, data)
  },

  deleteProject: async (projectId: number): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/projects/${projectId}`)
  },
}

// React Query hooks
export const useProjects = (params: ProjectsSearchParams = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.getProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProject = (projectId: number) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectsApi.getProjectById(projectId),
    enabled: !!projectId,
  })
}

export const useMyProjects = () => {
  return useQuery({
    queryKey: ['projects', 'my'],
    queryFn: () => projectsApi.getMyProjects(),
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: UpdateProjectRequest }) =>
      projectsApi.updateProject(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}