import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';



export default definePageLayout({
  universalIdentifier: '9d924817-9758-440e-bf63-0812a34cc57b',
  name: 'Contract Dashboard',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'b5deed48-65ee-477d-8912-a689f8141db1',
      title: 'Overview',
      position: 0,
      icon: 'IconFileAnalytics',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '687289e6-41a1-4fae-9bbf-af22a9c592af',
          title: ' ',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.CANVAS },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: 'c35471eb-1b1d-453b-9e48-3a25ef14b439',
          },
        },
      ],
    },
  ],
});
