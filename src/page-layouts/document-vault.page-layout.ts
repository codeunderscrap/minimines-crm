import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: 'e0e42bf2-5132-4c07-99a1-a77b0b8fb95f',
  name: 'Document Vault',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'd3bf5ebd-2d9a-4c48-a493-3853dd3185cc',
      title: 'Vault',
      position: 0,
      icon: 'IconLock',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '6c5488b9-92e0-4f4e-8525-ca443c4b9d79',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'b653a373-f56f-4807-b12a-863697f3a008',
          },
        },
      ],
    },
  ],
});
