import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';


export default definePageLayout({
  universalIdentifier: '27132806-9a86-4304-9abc-9fa41b53112b',
  name: 'Default Quotation Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: '71ba2bb5-f601-40b0-ba63-3dab06028c57',
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
            frontComponentUniversalIdentifier: '1e644aba-73c0-42f3-853c-69a22a310d17'
          },
        },
        {
          universalIdentifier: '65f81c2c-e681-4513-8a8c-cadb40174570',
          title: 'Quotation Details',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: '659f0064-f97b-4664-8659-e0c8d5ad8a42',
          },
        },
      ],
    },
  ],
});
