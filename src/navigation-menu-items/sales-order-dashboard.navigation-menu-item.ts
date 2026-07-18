import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  SALES_ORDER_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  SALES_ORDER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: SALES_ORDER_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Sales Dashboard',
  icon: 'IconBox',
  position: 5,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: SALES_ORDER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
