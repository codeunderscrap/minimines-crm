import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  ENQUIRY_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  ENQUIRY_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  ENQUIRY_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: ENQUIRY_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Inbound Leads Hub',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: ENQUIRY_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconMessageCircle',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: ENQUIRY_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
