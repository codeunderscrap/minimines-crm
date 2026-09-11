import { defineFrontComponent } from 'twenty-sdk/define';
import OpportunityDashboard from './opportunity-dashboard';

export default defineFrontComponent({
  universalIdentifier: 'dd02c145-f505-45d4-9846-fc1f734ac41b',
  name: 'Opportunity Pipeline',
  description: 'Kanban view for tracking deal negotiations',
  component: OpportunityDashboard,
});
