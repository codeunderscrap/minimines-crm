import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: '210c2f1a-6ef4-4599-9027-60c70a118cef',
  name: 'Leads Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '3f4da73d-6c4c-431a-a243-8263c6ee7bca',
      title: 'Overview',
      position: 0,
      icon: 'IconUserPlus',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '52183af8-e801-4a9f-b3f8-04b3f97352e8',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'f7a521d2-1f7e-41a8-a29d-62bd99f7f960',
          },
        },
      ],
    },
  ],
});
