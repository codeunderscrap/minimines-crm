import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  LME_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  LME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LME_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'LME Market Watch',
  icon: 'IconChartLine',
  position: 17,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: LME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
