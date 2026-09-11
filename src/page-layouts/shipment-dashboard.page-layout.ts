import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: '81463067-26a7-44cf-8e8f-72de3806f9cd',
  name: 'Shipment Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '1a458875-2c85-4314-9526-b32b08f69c6a',
      title: 'Overview',
      position: 0,
      icon: 'IconShip',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: 'ca9aae25-187a-453a-a3f5-4997a0f59e36',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'c87af8fb-27cb-4b36-a19e-4c55d064a371',
          },
        },
      ],
    },
  ],
});
