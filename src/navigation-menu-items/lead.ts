import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  LEAD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER, 
  LEADS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEAD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Leads',
  icon: 'IconUserPlus',
  position: 1,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: LEADS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
