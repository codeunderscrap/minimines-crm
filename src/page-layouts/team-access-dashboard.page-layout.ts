import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  TEAM_ACCESS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  TEAM_ACCESS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  TEAM_ACCESS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  TEAM_ACCESS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: TEAM_ACCESS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Team & Access',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: TEAM_ACCESS_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconUsersGroup',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: TEAM_ACCESS_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: TEAM_ACCESS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
