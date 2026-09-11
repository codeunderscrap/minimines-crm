import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: 'e281ef5e-14b2-423c-a7e5-f773b0da7ace',
  name: 'Team & Access',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: '9bfbe3ab-5395-4856-9f55-0443b8e7e20e',
      title: 'Overview',
      position: 0,
      icon: 'IconUsersGroup',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '7f8c23dc-e27b-4f17-934b-01aaa2f98f8d',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: '80f893a5-ffc4-4d3d-9618-d5a11525f8c3',
          },
        },
      ],
    },
  ],
});
