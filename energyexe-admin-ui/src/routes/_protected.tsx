import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@/components/layout/admin-layout'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ location }) => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
})