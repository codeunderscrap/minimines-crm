import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  LEADS_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER, 
  LEADS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEADS_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Lead Dashboard',
  icon: 'IconUserPlus',
  position: 11,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: LEADS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
