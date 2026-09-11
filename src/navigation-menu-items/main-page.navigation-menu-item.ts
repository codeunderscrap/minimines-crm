import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';



export default defineNavigationMenuItem({
  universalIdentifier: MAIN_PAGE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'MiniMines CRM',
  icon: 'IconFile',
  position: 0,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: '6d7d5294-ed49-46f1-9367-e853a1728b6a',
});

