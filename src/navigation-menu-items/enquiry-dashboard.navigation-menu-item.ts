import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  ENQUIRY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  ENQUIRY_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: ENQUIRY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Communications',
  icon: 'IconMessages',
  position: 8,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: ENQUIRY_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
