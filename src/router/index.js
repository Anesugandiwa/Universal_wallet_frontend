import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/Auth/login.vue'
import Register from '../components/Auth/register.vue'
import ForgotPassword from '../components/Auth/ForgotPassword.vue'
import ResetPassword from '../components/Auth/ResetPassword.vue'
import Dashboard from '../views/Dashboard.vue'
import Agents from '../views/admin/Agents.vue'
import Customers from '../views/admin/Customers.vue'
import Banks from '../views/admin/Banks.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  // Core Admin Functions
  {
    path: '/users',
    name: 'Users',
    //component: () => import('../views/admin/Users.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: Customers,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    //component: () => import('../views/admin/Transactions.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // Financial Management
  {
    path: '/fees',
    name: 'FeesAndCharges',
    //component: () => import('../views/admin/FeesAndCharges.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/commissions',
    name: 'Commissions',
    //component: () => import('../views/admin/Commissions.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // Agents & Merchants
  {
    path: '/agents',
    name: 'Agents',
    component: Agents,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/merchants',
    name: 'Merchants',
    //component: () => import('../views/admin/Merchants.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // Banking & Financial Institutions
  {
    path: '/banks',
    name: 'Banks',
    component: Banks,
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // Reports & Monitoring
  {
    path: '/reports',
    name: 'Reports',
    //component: () => import('../views/admin/Reports.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/audit',
    name: 'AuditLogs',
    //component: () => import('../views/admin/AuditLogs.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // System Configuration
  {
    path: '/notifications',
    name: 'Notifications',
    //component: () => import('../views/admin/Notifications.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    //component: () => import('../views/admin/Settings.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // User Profile (All authenticated users)
  {
    path: '/profile',
    name: 'Profile',
    //component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresGuest: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const tokenExpiresAt = localStorage.getItem('token_expires_at')

  // Check if token exists and is not expired
  let isAuthenticated = false
  if (token) {
    if (tokenExpiresAt) {
      isAuthenticated = Date.now() < parseInt(tokenExpiresAt)
    } else {
      // If no expiry time, assume token is valid
      isAuthenticated = true
    }
  }

  console.log('🔒 Router Guard:', {
    from: from.path,
    to: to.path,
    isAuthenticated,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest
  })

  // Redirect to login if route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login')
    next('/login')
  }
  // Redirect to dashboard if route requires guest and user is authenticated
  else if (to.meta.requiresGuest && isAuthenticated) {
    console.log('✅ Already authenticated, redirecting to dashboard')
    next('/dashboard')
  }
  else {
    console.log('✅ Allowing navigation')
    next()
  }
})

export default router
