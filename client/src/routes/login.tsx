import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/lib/users-api'
import { toast } from 'sonner'

function LoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value)
        toast.success('Login successful!')
        navigate({ to: '/' })
      } catch (error: any) {
        toast.error(error.message || 'Login failed')
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) =>
                  !value || value.trim().length === 0
                    ? 'Username is required'
                    : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Username</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your username"
                    disabled={loginMutation.isPending}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value || value.trim().length === 0
                    ? 'Password is required'
                    : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    disabled={loginMutation.isPending}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // Redirect to dashboard if already logged in
    const token = localStorage.getItem('access_token')
    if (token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: LoginPage,
})