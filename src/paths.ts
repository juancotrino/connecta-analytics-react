export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password'
  },
  dashboard: {
    // overview: '/dashboard',
    account: '/dashboard/account',
    // services: '/dashboard/services',
    services: {
      home: '/dashboard/services',
      segmentSpss: '/dashboard/services/segment-spss',
      transformToBelcorp: '/dashboard/services/transform-to-belcorp',
      noelDashboard: '/dashboard/services/noel-dashboard',
      newProjectInitialization: '/dashboard/services/new-project-initialization',
      miscellanyTools: '/dashboard/services/miscellany-tools',
    },
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
