import { definePageLayout, PageLayoutType } from 'twenty-sdk/define';
import { 
  SALES_ORDER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, 
  SALES_ORDER_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER, 
  SALES_ORDER_PAGE_WIDGET_UNIVERSAL_IDENTIFIER, 
  SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER 
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: SALES_ORDER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  type: PageLayoutType.FULL_PAGE,
  name: 'Sales Order Dashboard Layout',
  tabs: [
    {
      universalIdentifier: SALES_ORDER_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      name: 'Sales Order Tracker',
      widgets: [
        {
          universalIdentifier: SALES_ORDER_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          frontComponentUniversalIdentifier: SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
        },
      ],
    },
  ],
});
