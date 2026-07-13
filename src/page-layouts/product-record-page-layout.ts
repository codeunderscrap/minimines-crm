import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';
import {
  PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER,
  PRODUCT_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  PRODUCT_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  PRODUCT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER
} from '../constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: PRODUCT_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Default Product Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: '1e985a36-24d6-4641-ad69-67c24f18c4eb',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '1f2e2d26-2c01-457f-93d7-15713b3b7ff8',
          title: 'Product Pricing & Analytics',
          type: 'FRONT_COMPONENT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: PRODUCT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER
          },
        },
        {
          universalIdentifier: 'a2e4700c-eaea-4a6f-a05c-439ec7bac99f',
          title: 'Material Specifications',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: PRODUCT_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
