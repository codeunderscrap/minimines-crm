import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  SHIPMENT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  SHIPMENT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: SHIPMENT_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Shipment Dashboard',
  icon: 'IconShip',
  position: 6,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  folderUniversalIdentifier: 'f1b3e9c6-42b0-578c-94da-15e277dfb03b',
  pageLayoutUniversalIdentifier: SHIPMENT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
