import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  PRODUCT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  PRODUCT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  PRODUCT_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  PRODUCT_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: PRODUCT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Product Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: PRODUCT_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconBox',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: PRODUCT_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: PRODUCT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
