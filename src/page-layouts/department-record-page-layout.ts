import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';


export default definePageLayout({
  universalIdentifier: 'a29e370b-1402-4b5d-8e21-38e30dfee9ae',
  name: 'Default Department Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: '2d76ead8-21ea-4c17-bbbb-6f511175ebeb',
  tabs: [
    {
      universalIdentifier: '0a72acee-22e8-455b-96a6-2ff43793ff35',
      title: 'Home',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '584e2622-ffbe-4463-ab90-07bcd0b09571',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: '9d693e3c-5a18-4789-b5b4-8de9baac8a8a',
          },
        },
      ],
    },
  ],
});
