import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: 'b8e5d798-25d4-4678-a2a1-5754476c1e7b',
  name: 'Quotation Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '543bb9fc-98e3-4e09-974f-37eb1892aaf5',
      title: 'Overview',
      position: 0,
      icon: 'IconReceipt',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '692aaf8b-406d-43a2-825d-1688e62c9998',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: '1e644aba-73c0-42f3-853c-69a22a310d17',
          },
        },
      ],
    },
  ],
});
