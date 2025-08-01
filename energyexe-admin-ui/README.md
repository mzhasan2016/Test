# EnergyExe Admin UI

A modern React TypeScript admin dashboard for managing projects and users with full CRUD operations, built with the latest technologies and best practices.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, TanStack Router, TanStack Query, TanStack Form
- **Beautiful UI**: Tailwind CSS with shadcn/ui components for a polished design
- **Authentication**: JWT-based authentication with protected routes
- **Project Management**: Full CRUD operations for projects with status tracking, budgets, and timelines
- **User Management**: Complete user management with middle name support
- **Responsive Design**: Mobile-first responsive design that works on all devices
- **Real-time Updates**: Optimistic updates and real-time data synchronization
- **Form Validation**: Comprehensive client-side validation with error handling
- **Toast Notifications**: User-friendly notifications for all actions
- **Loading States**: Skeleton loading states for better UX
- **Type Safety**: Full TypeScript coverage for better development experience

## 🛠️ Tech Stack

### Core
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Routing & State Management
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack Query** - Server state management with caching
- **TanStack Form** - Performant forms with validation

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Low-level UI primitives
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
energyexe-admin-ui/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   └── projects/           # Project-specific components
│   ├── contexts/               # React contexts
│   ├── lib/                    # Utilities and API clients
│   ├── routes/                 # File-based routing
│   ├── types/                  # TypeScript type definitions
│   └── main.tsx               # Application entry point
├── public/                     # Static assets
└── ...config files
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energyexe-admin-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Generate route types**
   ```bash
   npm run routes:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run routes:generate` - Generate route types

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

### API Integration

The application expects a REST API with the following endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /users/me` - Get current user

#### Projects
- `GET /projects/` - List projects
- `POST /projects/` - Create project
- `GET /projects/{id}` - Get project by ID
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

#### Users
- `GET /users/` - List users
- `POST /users/` - Create user
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

## 🎨 UI Components

The application uses a comprehensive set of UI components built on top of Radix UI:

- **Forms**: Input, Textarea, Select, Checkbox, Label
- **Navigation**: Button, Link, Dropdown Menu
- **Feedback**: Toast notifications, Loading skeletons, Badges
- **Layout**: Card, Dialog, Separator
- **Data Display**: Data Table with search and sorting

## 🔐 Authentication Flow

1. User navigates to login page
2. Enters credentials and submits form
3. API returns JWT token and user data
4. Token is stored in localStorage
5. User is redirected to dashboard
6. Protected routes check for valid token
7. API requests include Authorization header

## 📊 Project Features

### Project Management
- **Create Projects**: Full form with validation
- **Edit Projects**: In-place editing with optimistic updates
- **Delete Projects**: Confirmation dialog with soft delete
- **Status Tracking**: Active, Completed, On Hold, Cancelled
- **Budget Management**: Currency formatting and validation
- **Timeline Management**: Start and end date tracking
- **Owner Assignment**: Assign projects to users

### Data Table Features
- **Search**: Real-time search across multiple columns
- **Sorting**: Click column headers to sort
- **Actions**: View, Edit, Delete actions per row
- **Responsive**: Mobile-friendly table design
- **Loading States**: Skeleton loading during data fetch

### Form Features
- **Real-time Validation**: Instant feedback on form fields
- **Error Handling**: Clear error messages and states
- **Optimistic Updates**: UI updates before API confirmation
- **Auto-save**: Form state preservation
- **Accessibility**: Full keyboard navigation and screen reader support

## 🌟 Key Features Implemented

### Middle Name Support
The application includes full support for middle names in user profiles:
- User registration form includes optional middle name field
- User display logic properly handles middle names
- API integration supports middle name in all user operations
- Forms validate and format names correctly

### Modal Pattern
Implements the recommended combined modal pattern:
- Single modal component handles both create and edit
- Key-based remounting ensures fresh form state
- Proper error handling and loading states
- Consistent UX between create and edit flows

### Error Handling
Comprehensive error handling throughout the application:
- API error parsing and display
- Form validation errors
- Network error recovery
- User-friendly error messages

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized production files.

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ directory to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [TanStack](https://tanstack.com/) for the excellent React libraries
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Built with ❤️ for the EnergyExe project**
