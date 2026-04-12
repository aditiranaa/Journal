import { NewspaperIcon } from 'lucide-react'
import { Navigate, useRoutes } from 'react-router'
import Layout from './components/layout'
import { NavGroup } from './components/layout/types'
import { useAuth } from './context/auth/authContext'

// Pages
import Landing from './features/journal/pages/Landing'
import Login from './features/authentication/login'
import Register from './features/authentication/register'
import Dashboard from './features/journal/pages/Dashboard'
import Editor from './features/journal/pages/Editor'
import EntryView from './features/journal/pages/EntryView'

/* ---------------- PRIVATE ROUTES ---------------- */
const privateRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        title: 'Journal',
        children: [
          {
            title: 'Dashboard',
            icon: NewspaperIcon,
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            title: 'New Entry',
            path: '/editor',
            element: <Editor />
          },
          {
            path: '/editor/:id',
            element: <Editor />
          },
          {
            hide: true,
            title: 'Entry View',
            path: '/entry/:id',
            element: <EntryView />
          }
        ]
      }
    ]
  }
]

/* ---------------- PUBLIC ROUTES ---------------- */
const publicRoutes = (isAuthenticated: boolean) => [
  {
    path: '/',
    element: isAuthenticated
      ? <Navigate to="/dashboard" />   // ✅ redirect if logged in
      : <Landing />                   // ✅ landing page
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]

/* ---------------- MENU ---------------- */
export const DashboardMenu = (): NavGroup[] => {
  return privateRoutes[0].children as NavGroup[]
}

/* ---------------- ROUTES APP ---------------- */
export const RoutesApp = () => {
  const { state: authState } = useAuth()

  return useRoutes([
    ...publicRoutes(authState.isAuthenticated),

    ...(authState.isAuthenticated ? privateRoutes : []),

    { path: '*', element: <Navigate to="/" replace /> }
  ])
}