import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  EXPORT_DOCUMENT_TRACKER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: EXPORT_DOCUMENT_TRACKER_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Export Documents',
  icon: 'IconFiles',
  position: 18,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
