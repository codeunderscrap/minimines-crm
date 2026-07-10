import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';

export default definePageLayout({
  universalIdentifier: 'e894db68-cfc6-4576-b5dd-c33500f4057e',
  name: 'Default Demos Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: 'b93b6468-40b4-4555-9541-d59a854c46da',
  tabs: [
    {
      universalIdentifier: 'cdf7d6c3-38e2-48b6-826d-193af5d10bc5',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'c0ca0f94-cfae-466d-8d18-a46f298d40ce',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: 'bcf5b650-7dad-4438-a78f-21a006d8028c',
          },
        },
      ],
    },
    {
      universalIdentifier: '38c603c4-c714-4211-9475-1ed7c97bd6a1',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '7f539756-1eb3-4bc5-a537-6a62ba1ed996',
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
