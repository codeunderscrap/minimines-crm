import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  TEAM_ACCESS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  TEAM_ACCESS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: TEAM_ACCESS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Team & Access',
  icon: 'IconUsersGroup',
  position: 1,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: TEAM_ACCESS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
