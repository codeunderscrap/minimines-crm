import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  COMPANY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  COMPANY_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: COMPANY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Company Dashboard',
  icon: 'IconBuildingCommunity',
  position: 6,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: COMPANY_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
