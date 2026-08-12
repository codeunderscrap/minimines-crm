import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  ONBOARDING_CONTRACTS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  ONBOARDING_CONTRACTS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  ONBOARDING_CONTRACTS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  ONBOARDING_CONTRACTS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: ONBOARDING_CONTRACTS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Company Contracts',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: ONBOARDING_CONTRACTS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Contracts Overview',
      position: 0,
      icon: 'IconSignature',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: ONBOARDING_CONTRACTS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: ONBOARDING_CONTRACTS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
