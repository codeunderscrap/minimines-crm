import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';


export default definePageLayout({
  universalIdentifier: 'f5ffeb70-2f42-4c97-a483-4578bcafd1b0',
  name: 'Sales Order Dashboard Layout',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'd9745600-9e73-415d-95ef-493d9bf0d0a4',
      title: 'Sales Order Tracker',
      position: 0,
      icon: 'IconBox',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '8247e07a-f04f-47d5-9569-7e9b8a3d8662',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: '22192d04-e682-4a94-afd3-1508a7d8bdb0',
          },
        },
      ],
    },
  ],
});
