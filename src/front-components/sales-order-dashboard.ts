import { defineFrontComponent } from 'twenty-sdk/define';
import SalesOrderDashboard from './sales-order-dashboard';

export default defineFrontComponent({
  universalIdentifier: '22192d04-e682-4a94-afd3-1508a7d8bdb0',
  name: 'Sales Order Dashboard',
  description: 'View for confirmed deals transferred from BD',
  component: SalesOrderDashboard,
});
