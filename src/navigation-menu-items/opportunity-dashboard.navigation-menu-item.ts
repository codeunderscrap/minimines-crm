import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  OPPORTUNITY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: OPPORTUNITY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Opportunity Pipeline',
  icon: 'IconTarget',
  position: 2, // Right after leads
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
