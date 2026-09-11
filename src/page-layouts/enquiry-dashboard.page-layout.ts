import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: '98571e56-9a50-4c65-9bfb-cd103c4cd3d8',
  name: 'Inbound Leads Hub',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '1edd3447-0dc9-4e7a-a739-060517885d32',
      title: 'Overview',
      position: 0,
      icon: 'IconMessageCircle',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '48fc1be6-3415-4f6a-8f6f-95084bac00b1',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: '6e51a256-6090-4531-84ee-c2f8543f1b5e',
          },
        },
      ],
    },
  ],
});
