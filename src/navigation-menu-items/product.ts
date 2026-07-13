import { defineNavigationMenuItem } from 'twenty-sdk/define';
import {
  PRODUCT_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  PRODUCT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: PRODUCT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Products & Materials',
  icon: 'IconBox',
  pageLayoutUniversalIdentifier: PRODUCT_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  position: 15,
});
