import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  QUOTATION_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  QUOTATION_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  QUOTATION_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: QUOTATION_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Quotation Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: QUOTATION_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconReceipt',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: QUOTATION_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
