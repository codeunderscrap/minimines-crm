import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: '540e4303-4b30-4a39-948a-ec80389463d5',
  name: 'Company Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '92f595dc-824c-498a-aa06-657a71c3e1fe',
      title: 'Overview',
      position: 0,
      icon: 'IconBuildingCommunity',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '2ef351ff-b335-4640-abce-5f9b100cd981',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: '4cf03718-59fa-4ce1-9869-019a277cdfdc',
          },
        },
      ],
    },
  ],
});
