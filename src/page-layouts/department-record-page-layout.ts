import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';
import {
  DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_RECORD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_RECORD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: DEPARTMENT_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Default Department Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  tabs: [
    {
      universalIdentifier: DEPARTMENT_RECORD_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: DEPARTMENT_RECORD_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: DEPARTMENT_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
