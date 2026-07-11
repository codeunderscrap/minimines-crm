import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';

export default definePageLayout({
  universalIdentifier: '49347d84-a817-4d98-ad90-4a9280515b22',
  name: 'Default Contracts Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: '651890c3-6208-429c-8e72-3e99adeb480e',
  tabs: [
    {
      universalIdentifier: '21b5b1a5-4a90-42a3-8c37-ac7eccc8c166',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'ebc13284-a15d-4f17-8e6f-bb3e3a39e802',
          title: 'Contract Analytics',
          type: 'FRONT_COMPONENT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'c35471eb-1b1d-453b-9e48-3a25ef14b439'
          },
        },
        {
          universalIdentifier: '83817eb7-83b6-4d5d-959d-b320c03fef74',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: '398ea509-f484-4f01-966f-36248e3b165b',
          },
        },
      ],
    },
    {
      universalIdentifier: 'd1305d3d-0e44-4ee4-9848-f1acfd40192b',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '4db5369f-bb0d-4866-942e-134cef24b467',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: {
            configurationType: 'TIMELINE',
          },
        },
      ],
    },
  ],
});
