import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';
import {
  DEPARTMENT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: DEPARTMENT_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Departments',
  icon: 'IconBuildingSkyscraper',
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  position: 22,
});
