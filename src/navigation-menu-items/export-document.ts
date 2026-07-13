import { defineNavigationMenuItem } from 'twenty-sdk/define';
import { NavigationMenuItemType } from 'twenty-sdk/types';

import {
  EXPORT_DOCUMENT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: EXPORT_DOCUMENT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  type: NavigationMenuItemType.Object,
  objectUniversalIdentifier: EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
});
