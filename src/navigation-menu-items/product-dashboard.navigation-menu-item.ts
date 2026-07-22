import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  PRODUCT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  PRODUCT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: PRODUCT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Product Dashboard',
  icon: 'IconBox',
  position: 19,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: PRODUCT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
