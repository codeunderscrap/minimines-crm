import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';

export default definePageLayout({
  universalIdentifier: '095eb64c-7415-4d78-a17d-3a2faa921c7c',
  name: 'Default LME Trackers Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: '03987302-22c9-4308-a280-e16738c722af',
  tabs: [
    {
      universalIdentifier: 'badcde7a-0e96-40ff-8402-48aac2ea2168',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '9de0e491-6087-414d-9551-3b1ee6810cbd',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: 'b0fb7792-12b1-453e-b4dd-5f72d5978726',
          },
        },
      ],
    },
    {
      universalIdentifier: '6850e07c-9e2d-46da-908b-c7fb7271cf90',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: 'c093242f-e8da-4e41-87c0-a216e3974c50',
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
