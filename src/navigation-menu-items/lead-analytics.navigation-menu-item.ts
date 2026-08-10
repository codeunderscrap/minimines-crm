import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  LEAD_ANALYTICS_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEAD_ANALYTICS_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Lead Analytics',
  icon: 'IconChartBar',
  position: 7,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  folderUniversalIdentifier: 'e4a2d8b5-31a9-467b-83c9-04d166cfa92a',
  pageLayoutUniversalIdentifier: LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});

