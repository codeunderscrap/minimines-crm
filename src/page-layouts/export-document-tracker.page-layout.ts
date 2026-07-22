import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  EXPORT_DOCUMENT_TRACKER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_TRACKER_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Export Documents',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: EXPORT_DOCUMENT_TRACKER_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Overview',
      position: 0,
      icon: 'IconFiles',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: EXPORT_DOCUMENT_TRACKER_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: EXPORT_DOCUMENT_TRACKER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
