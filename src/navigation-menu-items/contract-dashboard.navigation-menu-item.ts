import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  CONTRACT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  CONTRACT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: CONTRACT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Contract Dashboard',
  icon: 'IconFileAnalytics',
  position: 14,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: CONTRACT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
