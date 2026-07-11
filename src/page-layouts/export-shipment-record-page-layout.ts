import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';

export default definePageLayout({
  universalIdentifier: '4249a59b-c3cc-44a3-b0f7-ccc44489209b',
  name: 'Default Export Shipments Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: '04acd819-f079-4dde-b36d-1eb14b47167d',
  tabs: [
    {
      universalIdentifier: 'e1ef29b2-e29e-4612-a1df-56ef33e4e21b',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'cc903b7a-91a6-4c21-bcf2-dbe0da80b7f7',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: 'e8ff2a81-82f9-4433-a487-cfde7706f687',
          },
        },
      ],
    },
    {
      universalIdentifier: '5f277acd-4a5f-4af8-a732-be7a66adf97a',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: 'a0a327cc-df6b-4ec2-8f45-15711ac40e1c',
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
