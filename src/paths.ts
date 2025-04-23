export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password'
  },
  welcome: '/welcome',
  studyAdmin: {
    home: '/study-administrator',
    studyForm: '/study-administrator/study-form',
  },
  services: {
    home: '/services',
    segmentSpss: '/services/segment-spss',
    transformToBelcorp: '/services/transform-to-belcorp',
    noelDashboard: '/services/noel-dashboard',
    newProjectInitialization: '/services/new-project-initialization',
    miscellanyTools: '/services/miscellany-tools',
  },
  account: '/account',
  settings: '/settings',
} as const;
