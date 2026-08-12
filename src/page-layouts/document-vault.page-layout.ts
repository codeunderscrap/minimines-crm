import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  DOCUMENT_VAULT_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  DOCUMENT_VAULT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  DOCUMENT_VAULT_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  DOCUMENT_VAULT_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: DOCUMENT_VAULT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Document Vault',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: DOCUMENT_VAULT_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Vault',
      position: 0,
      icon: 'IconLock',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: DOCUMENT_VAULT_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: ' ',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: DOCUMENT_VAULT_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
