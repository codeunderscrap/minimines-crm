import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  INTERN_ANALYTICS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  INTERN_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: INTERN_ANALYTICS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Intern Analytics',
  icon: 'IconPhoneCall',
  position: 16,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: INTERN_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
