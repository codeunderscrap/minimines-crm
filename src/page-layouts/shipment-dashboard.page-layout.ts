import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  SHIPMENT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  SHIPMENT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  SHIPMENT_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  SHIPMENT_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: SHIPMENT_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Shipment Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: SHIPMENT_DASHBOARD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconShip',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: SHIPMENT_DASHBOARD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: SHIPMENT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
