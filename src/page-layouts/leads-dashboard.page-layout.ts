import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  LEADS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  LEADS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  LEADS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
  LEADS_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: LEADS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Leads Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: LEADS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconUserPlus',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: LEADS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: LEADS_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
