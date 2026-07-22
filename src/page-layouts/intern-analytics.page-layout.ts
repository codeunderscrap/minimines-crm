import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  INTERN_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  INTERN_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  INTERN_ANALYTICS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  INTERN_ANALYTICS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: INTERN_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Intern Analytics',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: INTERN_ANALYTICS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconPhoneCall',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: INTERN_ANALYTICS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: INTERN_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
