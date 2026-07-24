import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  QUOTATION_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  QUOTATION_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: QUOTATION_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Quotation Dashboard',
  icon: 'IconReceipt',
  position: 4,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: QUOTATION_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
