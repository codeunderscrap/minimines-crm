import { definePageLayout, PageLayoutType } from 'twenty-sdk/define';
import { 
  OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, 
  OPPORTUNITY_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER, 
  OPPORTUNITY_PAGE_WIDGET_UNIVERSAL_IDENTIFIER, 
  OPPORTUNITY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER 
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: OPPORTUNITY_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  type: PageLayoutType.FULL_PAGE,
  name: 'Opportunity Pipeline Layout',
  tabs: [
    {
      universalIdentifier: OPPORTUNITY_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      name: 'BD Pipeline',
      widgets: [
        {
          universalIdentifier: OPPORTUNITY_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          frontComponentUniversalIdentifier: OPPORTUNITY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
        },
      ],
    },
  ],
});
