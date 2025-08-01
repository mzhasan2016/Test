import { PrismaClient } from '@prisma/client';
import { 
  CreateProjectData, 
  UpdateProjectData, 
  ProjectResponse, 
  ProjectSearchParams,
  ProjectStats 
} from '../models/project.model';

export class ProjectService {
  constructor(private prisma: PrismaClient) {}

  async createProject(data: CreateProjectData): Promise<ProjectResponse> {
    // Validate required fields
    if (!data.name || !data.owner_id) {
      throw new Error('Name and owner_id are required');
    }

    // Check if owner exists
    const owner = await this.prisma.user.findUnique({
      where: { id: data.owner_id }
    });

    if (!owner) {
      throw new Error('Owner not found');
    }

    // Validate dates if provided
    if (data.start_date && data.end_date) {
      if (data.start_date > data.end_date) {
        throw new Error('Start date cannot be after end date');
      }
    }

    // Create project
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || 'active',
        budget: data.budget,
        start_date: data.start_date,
        end_date: data.end_date,
        owner_id: data.owner_id,
        is_active: true
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            first_name: true,
            middle_name: true,
            last_name: true
          }
        }
      }
    });

    // Convert null to undefined for interface compatibility
    return {
      ...project,
      status: project.status as any,
      description: project.description || undefined,
      budget: project.budget || undefined,
      start_date: project.start_date || undefined,
      end_date: project.end_date || undefined,
      owner: project.owner ? {
        ...project.owner,
        middle_name: project.owner.middle_name || undefined
      } : undefined
    };
  }

  async findProjectById(id: number): Promise<ProjectResponse | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            first_name: true,
            middle_name: true,
            last_name: true
          }
        }
      }
    });

    if (!project) return null;

    // Convert null to undefined for interface compatibility
    return {
      ...project,
      status: project.status as any,
      description: project.description || undefined,
      budget: project.budget || undefined,
      start_date: project.start_date || undefined,
      end_date: project.end_date || undefined,
      owner: project.owner ? {
        ...project.owner,
        middle_name: project.owner.middle_name || undefined
      } : undefined
    };
  }

  async getAllProjects(params: ProjectSearchParams = {}): Promise<{
    projects: ProjectResponse[];
    total: number;
  }> {
    const { skip = 0, limit = 10, search, status, owner_id } = params;

    // Build where clause
    const where: any = { is_active: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (owner_id) {
      where.owner_id = owner_id;
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
              first_name: true,
              middle_name: true,
              last_name: true
            }
          }
        }
      }),
      this.prisma.project.count({ where })
    ]);

    // Convert null to undefined for interface compatibility
    const formattedProjects: ProjectResponse[] = projects.map(project => ({
      ...project,
      status: project.status as any,
      description: project.description || undefined,
      budget: project.budget || undefined,
      start_date: project.start_date || undefined,
      end_date: project.end_date || undefined,
      owner: project.owner ? {
        ...project.owner,
        middle_name: project.owner.middle_name || undefined
      } : undefined
    }));

    return { projects: formattedProjects, total };
  }

  async getProjectsByOwner(ownerId: number, params: ProjectSearchParams = {}): Promise<{
    projects: ProjectResponse[];
    total: number;
  }> {
    return this.getAllProjects({
      ...params,
      owner_id: ownerId
    });
  }

  async updateProject(id: number, data: UpdateProjectData): Promise<ProjectResponse> {
    // Check if project exists
    const existingProject = await this.prisma.project.findUnique({
      where: { id }
    });

    if (!existingProject) {
      throw new Error('Project not found');
    }

    // Check if owner exists if updating owner_id
    if (data.owner_id && data.owner_id !== existingProject.owner_id) {
      const owner = await this.prisma.user.findUnique({
        where: { id: data.owner_id }
      });

      if (!owner) {
        throw new Error('Owner not found');
      }
    }

    // Validate dates if provided
    if (data.start_date && data.end_date) {
      if (data.start_date > data.end_date) {
        throw new Error('Start date cannot be after end date');
      }
    }

    // Update project
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.start_date && { start_date: data.start_date }),
        ...(data.end_date && { end_date: data.end_date }),
        ...(data.owner_id && { owner_id: data.owner_id })
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            first_name: true,
            middle_name: true,
            last_name: true
          }
        }
      }
    });

    // Convert null to undefined for interface compatibility
    return {
      ...project,
      status: project.status as any,
      description: project.description || undefined,
      budget: project.budget || undefined,
      start_date: project.start_date || undefined,
      end_date: project.end_date || undefined,
      owner: project.owner ? {
        ...project.owner,
        middle_name: project.owner.middle_name || undefined
      } : undefined
    };
  }

  async deleteProject(id: number): Promise<void> {
    // Check if project exists
    const existingProject = await this.prisma.project.findUnique({
      where: { id }
    });

    if (!existingProject) {
      throw new Error('Project not found');
    }

    // Soft delete by setting is_active to false
    await this.prisma.project.update({
      where: { id },
      data: { is_active: false }
    });
  }

  async getProjectStats(): Promise<ProjectStats> {
    const [total, active, completed, on_hold, cancelled] = await Promise.all([
      this.prisma.project.count({ where: { is_active: true } }),
      this.prisma.project.count({ where: { is_active: true, status: 'active' } }),
      this.prisma.project.count({ where: { is_active: true, status: 'completed' } }),
      this.prisma.project.count({ where: { is_active: true, status: 'on_hold' } }),
      this.prisma.project.count({ where: { is_active: true, status: 'cancelled' } })
    ]);

    return {
      total,
      active,
      completed,
      on_hold,
      cancelled
    };
  }

  async getProjectStatsByOwner(ownerId: number): Promise<ProjectStats> {
    const [total, active, completed, on_hold, cancelled] = await Promise.all([
      this.prisma.project.count({ where: { is_active: true, owner_id: ownerId } }),
      this.prisma.project.count({ where: { is_active: true, owner_id: ownerId, status: 'active' } }),
      this.prisma.project.count({ where: { is_active: true, owner_id: ownerId, status: 'completed' } }),
      this.prisma.project.count({ where: { is_active: true, owner_id: ownerId, status: 'on_hold' } }),
      this.prisma.project.count({ where: { is_active: true, owner_id: ownerId, status: 'cancelled' } })
    ]);

    return {
      total,
      active,
      completed,
      on_hold,
      cancelled
    };
  }
}
