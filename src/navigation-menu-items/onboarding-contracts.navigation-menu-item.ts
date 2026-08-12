import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  ONBOARDING_CONTRACTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  ONBOARDING_CONTRACTS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  SHIPMENTS_FOLDER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: ONBOARDING_CONTRACTS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Company Contracts',
  icon: 'IconSignature',
  position: 1,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  folderUniversalIdentifier: SHIPMENTS_FOLDER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: ONBOARDING_CONTRACTS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
