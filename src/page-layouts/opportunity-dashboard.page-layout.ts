import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';
import { 
  OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, 
  OPPORTUNITY_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER, 
  OPPORTUNITY_PAGE_WIDGET_UNIVERSAL_IDENTIFIER, 
  OPPORTUNITY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER 
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Opportunity Pipeline Layout',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: OPPORTUNITY_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'BD Pipeline',
      position: 0,
      icon: 'IconTarget',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: OPPORTUNITY_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: OPPORTUNITY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
