import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  LEAD_ANALYTICS_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEAD_ANALYTICS_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Lead Analytics',
  icon: 'IconChartBar',
  position: 1, // Before leads
  type: NavigationMenuItemType.PAGE_LAYOUT,
  targetPageLayoutUniversalIdentifier: LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
