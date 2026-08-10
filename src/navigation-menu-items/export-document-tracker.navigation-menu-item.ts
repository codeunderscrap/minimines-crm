import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  EXPORT_DOCUMENT_TRACKER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: EXPORT_DOCUMENT_TRACKER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Export Documents',
  icon: 'IconFiles',
  position: 14,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  folderUniversalIdentifier: 'f1b3e9c6-42b0-578c-94da-15e277dfb03b',
  pageLayoutUniversalIdentifier: EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
