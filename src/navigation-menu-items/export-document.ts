import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import {
  EXPORT_DOCUMENT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: EXPORT_DOCUMENT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Export Documents',
  icon: 'IconFileText',
  position: 101,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
});
