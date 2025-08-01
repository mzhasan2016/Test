import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteProject } from '@/lib/projects-api'
import { toast } from 'sonner'
import type { Project } from '@/types/project'

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onDeleteSuccess?: () => void
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  onDeleteSuccess,
}: DeleteProjectDialogProps) {
  const deleteProjectMutation = useDeleteProject()

  const handleDelete = async () => {
    if (!project) return

    try {
      await deleteProjectMutation.mutateAsync(project.id)
      toast.success('Project deleted successfully')
      onOpenChange(false)
      onDeleteSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project')
    }
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteProjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProjectMutation.isPending}
          >
            {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}