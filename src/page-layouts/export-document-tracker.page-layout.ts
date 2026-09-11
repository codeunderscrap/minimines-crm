import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: 'a42520ef-fdd7-4159-b1bf-c2fe6d9b9828',
  name: 'Export Documents',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'df6827ea-91ed-44df-bcd9-c3f172c91093',
      title: 'Overview',
      position: 0,
      icon: 'IconFiles',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '5cab2c56-fbca-4c0a-afaf-1724d3a119c6',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'd3087b5b-ef89-475d-8caa-629abff0be7e',
          },
        },
      ],
    },
  ],
});
