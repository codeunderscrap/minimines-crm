import { defineFrontComponent } from 'twenty-sdk/define';
import LeadsDashboard from './leads-dashboard';

export default defineFrontComponent({
  universalIdentifier: 'f7a521d2-1f7e-41a8-a29d-62bd99f7f960',
  name: 'Leads Dashboard',
  description: 'Role-aware lead distribution dashboard with cascading assignment.',
  component: LeadsDashboard,
});
