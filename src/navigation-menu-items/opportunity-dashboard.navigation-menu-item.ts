import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  OPPORTUNITY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: OPPORTUNITY_DASHBOARD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Opportunity Pipeline',
  icon: 'IconTarget',
  position: 3,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  folderUniversalIdentifier: 'e4a2d8b5-31a9-467b-83c9-04d166cfa92a',
  pageLayoutUniversalIdentifier: OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});

