import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';
import { 
  SALES_ORDER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, 
  SALES_ORDER_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER, 
  SALES_ORDER_PAGE_WIDGET_UNIVERSAL_IDENTIFIER, 
  SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER 
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: SALES_ORDER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Sales Order Dashboard Layout',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: SALES_ORDER_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Sales Order Tracker',
      position: 0,
      icon: 'IconBox',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: SALES_ORDER_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
