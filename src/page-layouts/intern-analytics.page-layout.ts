import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: '98e3af4f-c747-496c-a470-3c5e288e8cd5',
  name: 'Associate Analytics',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '1f9d824e-e40e-4423-bfa3-649b4b1eb095',
      title: 'Overview',
      position: 0,
      icon: 'IconPhoneCall',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '4c987c29-e10b-41b2-aea4-d36648f9fc6e',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: '970a20de-6142-4a05-a871-6eaa13fdb035',
          },
        },
      ],
    },
  ],
});
