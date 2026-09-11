import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';


export default definePageLayout({
  universalIdentifier: '4f324362-46e8-45fd-b81a-f1b2e3b17e6b',
  name: 'Opportunity Pipeline Layout',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '8d8f89ec-f8d4-49de-8ac0-ac2b55ac5566',
      title: 'BD Pipeline',
      position: 0,
      icon: 'IconTarget',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '12f78ee0-56d3-4b56-818c-fd3a89af2dc0',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'dd02c145-f505-45d4-9846-fc1f734ac41b',
          },
        },
      ],
    },
  ],
});
