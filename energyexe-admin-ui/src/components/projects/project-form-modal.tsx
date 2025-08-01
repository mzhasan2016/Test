import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateProject, useUpdateProject } from '@/lib/projects-api'
import { useUsers } from '@/lib/users-api'
import { useAuth } from '@/contexts/auth-context'
import { formatDisplayName } from '@/lib/utils'
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectStatus } from '@/types/project'
import { PROJECT_STATUS_LABELS } from '@/types/project'

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project  // undefined for create, Project object for edit
}

export function ProjectFormModal({
  open,
  onOpenChange,
  project,
}: ProjectFormModalProps) {
  const isEdit = !!project
  const { user } = useAuth()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const { data: users = [] } = useUsers({ limit: 1000 })

  const form = useForm({
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      status: project?.status || 'active' as ProjectStatus,
      budget: project?.budget?.toString() || '',
      start_date: project?.start_date?.split('T')[0] || '',
      end_date: project?.end_date?.split('T')[0] || '',
      owner_id: project?.owner_id || user?.id || 0,
    },
    onSubmit: async ({ value }) => {
      try {
        // Validate dates
        if (value.start_date && value.end_date) {
          const startDate = new Date(value.start_date)
          const endDate = new Date(value.end_date)
          if (startDate > endDate) {
            toast.error('Start date cannot be after end date')
            return
          }
        }

        const data = {
          name: value.name,
          description: value.description || undefined,
          status: value.status,
          budget: value.budget ? parseFloat(value.budget) : undefined,
          start_date: value.start_date || undefined,
          end_date: value.end_date || undefined,
          owner_id: value.owner_id,
        }

        if (isEdit) {
          await updateProject.mutateAsync({
            projectId: project.id,
            data: data as UpdateProjectRequest,
          })
          toast.success('Project updated successfully')
        } else {
          await createProject.mutateAsync(data as CreateProjectRequest)
          toast.success('Project created successfully')
        }
        
        onOpenChange(false)
        form.reset()
      } catch (error: any) {
        toast.error(error.message || 'An error occurred')
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Project' : 'Create Project'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update the project details below.'
              : 'Enter the details for the new project.'}
          </DialogDescription>
        </DialogHeader>
        
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value || value.trim().length === 0
                      ? 'Project name is required'
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Project Name *</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter project name"
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-destructive mt-1">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="col-span-2">
              <form.Field name="description">
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Description</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="status">
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Status</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value as ProjectStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="budget">
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Budget</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="start_date">
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Start Date</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="end_date">
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>End Date</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {user?.is_superuser && (
              <div className="col-span-2">
                <form.Field name="owner_id">
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name}>Owner</Label>
                      <Select
                        value={field.state.value.toString()}
                        onValueChange={(value) => field.handleChange(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {formatDisplayName(user)} ({user.username})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createProject.isPending || updateProject.isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button 
                  type="submit" 
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting 
                    ? 'Saving...' 
                    : isEdit 
                      ? 'Update Project' 
                      : 'Create Project'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}