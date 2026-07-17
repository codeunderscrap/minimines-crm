import { definePageLayout, PageLayoutType } from 'twenty-sdk/define';
import { 
  LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, 
  LEAD_ANALYTICS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER, 
  LEAD_ANALYTICS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER, 
  LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER 
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: LEAD_ANALYTICS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  type: PageLayoutType.FULL_PAGE,
  name: 'Lead Analytics Layout',
  tabs: [
    {
      universalIdentifier: LEAD_ANALYTICS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      name: 'Analytics Dashboard',
      widgets: [
        {
          universalIdentifier: LEAD_ANALYTICS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          frontComponentUniversalIdentifier: LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
        },
      ],
    },
  ],
});
