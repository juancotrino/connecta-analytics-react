import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'segment-spss', title: 'Segment SPSS', href: paths.dashboard.services.segmentSpss },
  { key: 'transform-to-belcorp', title: 'Transform to Belcorp', href: paths.dashboard.services.transformToBelcorp },
  { key: 'noel-dashboard', title: 'NOEL Dashboard', href: paths.dashboard.services.noelDashboard },
  { key: 'new-project-initialization', title: 'New Project Initialization', href: paths.dashboard.services.newProjectInitialization },
  { key: 'miscellany-tools', title: 'Miscellany Tools', href: paths.dashboard.services.miscellanyTools },
] satisfies NavItemConfig[];
