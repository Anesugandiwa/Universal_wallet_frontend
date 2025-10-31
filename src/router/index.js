import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/Auth/login.vue'
import Register from '../components/Auth/register.vue'
import Dashboard from '../views/Dashboard.vue'

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
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/send',
    name: 'SendMoney',
    component: () => import('../views/SendMoney.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/receive',
    name: 'ReceiveMoney',
    component: () => import('../views/ReceiveMoney.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: () => import('../views/Exchange.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/audit',
    name: 'AuditLogs',
    component: () => import('../views/AuditLogs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token

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
