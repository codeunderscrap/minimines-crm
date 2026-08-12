import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { SHIPMENTS_FOLDER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: SHIPMENTS_FOLDER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Shipments',
  icon: 'IconShip',
  position: 30,
  type: NavigationMenuItemType.FOLDER,
});
