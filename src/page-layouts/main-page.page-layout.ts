import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: '6d7d5294-ed49-46f1-9367-e853a1728b6a',
  name: 'MiniMines CRM',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'a02acca0-be5d-4a55-81aa-6e199ef7f9e1',
      title: 'Overview',
      position: 0,
      icon: 'IconApps',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '9f8b67d1-6527-499c-a424-a08b5ea13de4',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier:
              '15f463bc-e392-4681-bdbb-047e4d3ad1e9',
          },
        },
      ],
    },
  ],
});
