import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: 'a352fc93-f4da-40ac-9adc-9404266a81b9',
  name: 'Company Contracts',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'cc5a90ec-fe15-4906-b9d0-a6d1e75fcc8d',
      title: 'Contracts Overview',
      position: 0,
      icon: 'IconSignature',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: 'e890a94a-8260-486f-91ce-10716f9e487e',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'ebadd2b2-c515-4df5-ac2f-0ec3262b6bc5',
          },
        },
      ],
    },
  ],
});
