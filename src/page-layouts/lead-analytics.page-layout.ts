import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';


export default definePageLayout({
  universalIdentifier: '8d299749-93e7-451e-aa37-f2b5c0b29fef',
  name: 'Lead Analytics Layout',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '0bf13311-dae1-4e78-9242-004cfbf6daef',
      title: 'Analytics Dashboard',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '70900ba7-4793-47b0-a77f-98944b7cb5a9',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'd6bc6e6c-45f6-48b7-a4f3-8f8336f43526',
          },
        },
      ],
    },
  ],
});
