import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRegister } from '@/lib/users-api'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'

function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      middle_name: '',
      last_name: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Validate passwords match
        if (value.password !== value.confirmPassword) {
          toast.error('Passwords do not match')
          return
        }

        // Validate password strength
        if (value.password.length < 6) {
          toast.error('Password must be at least 6 characters long')
          return
        }

        const registerData = {
          username: value.username,
          email: value.email,
          password: value.password,
          first_name: value.first_name || undefined,
          middle_name: value.middle_name || undefined,
          last_name: value.last_name || undefined,
        }

        await registerMutation.mutateAsync(registerData)
        toast.success('Registration successful! Please login with your credentials.')
        navigate({ to: '/login' })
      } catch (error: any) {
        toast.error(error.message || 'Registration failed')
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create a new account
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
                onChange: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'Username is required'
                  }
                  if (value.length < 3) {
                    return 'Username must be at least 3 characters'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Username *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your username"
                    disabled={registerMutation.isPending}
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
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'Email is required'
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email"
                    disabled={registerMutation.isPending}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="first_name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>First Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="First name"
                      disabled={registerMutation.isPending}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="last_name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Last Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Last name"
                      disabled={registerMutation.isPending}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="middle_name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Middle Name (Optional)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Middle name (optional)"
                    disabled={registerMutation.isPending}
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'Password is required'
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    disabled={registerMutation.isPending}
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
              name="confirmPassword"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'Please confirm your password'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Confirm Password *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Confirm your password"
                    disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    // Redirect to dashboard if already logged in
    const token = localStorage.getItem('access_token')
    if (token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RegisterPage,
})