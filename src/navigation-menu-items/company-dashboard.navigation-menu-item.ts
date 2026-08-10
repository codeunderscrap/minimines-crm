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
  folderUniversalIdentifier: 'e4a2d8b5-31a9-467b-83c9-04d166cfa92a',
  pageLayoutUniversalIdentifier: COMPANY_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
