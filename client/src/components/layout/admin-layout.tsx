import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Home, FolderOpen, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { formatDisplayName, cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">EnergyExe</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="mt-8">
          <div className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user ? formatDisplayName(user) : 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">EnergyExe</h1>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}