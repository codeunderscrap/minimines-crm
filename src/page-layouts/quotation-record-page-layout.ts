import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';
import {
  QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  QUOTATION_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  QUOTATION_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: QUOTATION_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Default Quotation Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: 'a2913e65-e765-42aa-b0f5-23745691fd02',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '994f4281-7e77-49cc-ba17-654c51c37146',
          title: 'Quotation Workflow Dashboard',
          type: 'FRONT_COMPONENT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER
          },
        },
        {
          universalIdentifier: '65f81c2c-e681-4513-8a8c-cadb40174570',
          title: 'Quotation Details',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: QUOTATION_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
