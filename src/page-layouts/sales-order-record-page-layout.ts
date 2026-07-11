import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';

export default definePageLayout({
  universalIdentifier: 'e1167142-8320-4a9f-97d6-411f478fe042',
  name: 'Default Sales Orders Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0',
  tabs: [
    {
      universalIdentifier: '98fe632c-01c1-4520-b8ec-6bcf882c592b',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '48d5e137-941f-43ef-9aa0-a9b54e419f7a',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: 'cd190b6f-35a5-4f80-baf1-09ca494aa50b',
          },
        },
      ],
    },
    {
      universalIdentifier: 'c48f9d00-cb17-4a9f-8d0c-8d72708dc3ba',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: 'a56316f3-cf89-427d-83cf-5210413c8c2d',
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
