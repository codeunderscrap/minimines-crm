import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  CONTRACT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  CONTRACT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: CONTRACT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Contract Dashboard',
  icon: 'IconFileAnalytics',
  position: 5,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  folderUniversalIdentifier: 'e4a2d8b5-31a9-467b-83c9-04d166cfa92a',
  pageLayoutUniversalIdentifier: CONTRACT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
