import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';


export default definePageLayout({
  universalIdentifier: '4b2f50a6-42d4-4a41-adb6-e560c5950100',
  name: 'Default Product Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: '89f006c5-0854-488a-9a8c-750974c8a222',
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
            frontComponentUniversalIdentifier: '5d2183d3-4eea-4228-bdcd-68859871c430'
          },
        },
        {
          universalIdentifier: 'a2e4700c-eaea-4a6f-a05c-439ec7bac99f',
          title: 'Material Specifications',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: 'e2df3922-20e5-41c3-a074-3eb6c88f8ca1',
          },
        },
      ],
    },
  ],
});
