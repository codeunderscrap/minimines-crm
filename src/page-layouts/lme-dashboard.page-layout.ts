import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  LME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  LME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  LME_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  LME_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: LME_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'LME Market Watch',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: LME_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconChartLine',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: LME_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: LME_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
