import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';
import { 
  LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, 
  LEAD_ANALYTICS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER, 
  LEAD_ANALYTICS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER, 
  LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER 
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Lead Analytics Layout',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: LEAD_ANALYTICS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Analytics Dashboard',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: LEAD_ANALYTICS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
