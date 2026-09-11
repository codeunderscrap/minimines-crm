import { defineFrontComponent } from 'twenty-sdk/define';
import TeamAccessDashboard from './team-access-dashboard';

export default defineFrontComponent({
  universalIdentifier: '80f893a5-ffc4-4d3d-9618-d5a11525f8c3',
  name: 'Team & Access',
  description: 'Admin control center for people, roles, departments, and org hierarchy.',
  component: TeamAccessDashboard,
});
