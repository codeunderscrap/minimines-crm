import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import { 
  LEAD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER, 
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEAD_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Lead Database',
  icon: 'IconDatabase',
  position: 130,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
});
