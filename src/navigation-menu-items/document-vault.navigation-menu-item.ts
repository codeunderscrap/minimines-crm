import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  DOCUMENT_VAULT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  DOCUMENT_VAULT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: DOCUMENT_VAULT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Document Vault',
  icon: 'IconLock',
  position: 40,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: DOCUMENT_VAULT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
