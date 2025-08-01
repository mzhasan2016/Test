import { useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/ui/data-table'
import { ProjectFormModal } from './project-form-modal'
import { DeleteProjectDialog } from './delete-project-dialog'
import { useProjects } from '@/lib/projects-api'
import { formatDisplayName, formatCurrency, formatDate } from '@/lib/utils'
import type { Project } from '@/types/project'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types/project'

export function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  const { data: projects, isLoading, error } = useProjects({ limit: 1000 })

  const handleEdit = (project: Project) => {
    setEditingProject(project)
  }

  const handleDelete = (project: Project) => {
    setDeletingProject(project)
  }

  const handleView = (project: Project) => {
    // For now, just edit. In a full implementation, this would navigate to a detail page
    handleEdit(project)
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (project: Project) => (
        <div>
          <div className="font-medium">{project.name}</div>
          {project.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {project.description.length > 100
                ? `${project.description.substring(0, 100)}...`
                : project.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (project: Project) => (
        <Badge className={PROJECT_STATUS_COLORS[project.status]}>
          {PROJECT_STATUS_LABELS[project.status]}
        </Badge>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (project: Project) => {
        if (!project.owner) return <span className="text-muted-foreground">-</span>
        
        return (
          <div>
            <div className="font-medium">{formatDisplayName(project.owner)}</div>
            <div className="text-sm text-muted-foreground">{project.owner.email}</div>
          </div>
        )
      },
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (project: Project) => {
        if (!project.budget) return <span className="text-muted-foreground">-</span>
        return formatCurrency(project.budget)
      },
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (project: Project) => {
        if (!project.start_date) return <span className="text-muted-foreground">-</span>
        return formatDate(project.start_date)
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (project: Project) => formatDate(project.created_at),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project: Project) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleView(project)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(project)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(project)
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and track progress
            </p>
          </div>
        </div>
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-sm text-destructive">
            Failed to load projects. Please try again.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and track progress
            </p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage projects and their information
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects && projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first project
              </Button>
            </div>
          ) : (
            <DataTable
              data={projects || []}
              columns={columns}
              searchableColumns={['name', 'description']}
              searchPlaceholder="Search projects..."
            />
          )}
        </CardContent>
      </Card>

      {/* CRITICAL: Key prop forces modal remount when entity changes */}
      <ProjectFormModal
        key={editingProject?.id || 'create'}
        open={isCreateModalOpen || !!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false)
            setEditingProject(undefined)
          }
        }}
        project={editingProject}
      />

      <DeleteProjectDialog
        open={!!deletingProject}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProject(null)
          }
        }}
        project={deletingProject}
      />
    </div>
  )
}