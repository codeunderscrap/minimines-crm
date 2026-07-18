import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  QUOTATION_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  QUOTATION_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: QUOTATION_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Quotations',
  icon: 'IconReceipt',
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  position: 12,
});

