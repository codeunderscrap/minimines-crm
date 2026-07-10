import {
  defineView,
  generateDefaultFieldUniversalIdentifier,
} from 'twenty-sdk/define';

export default defineView({
  universalIdentifier: 'bcf5b650-7dad-4438-a78f-21a006d8028c',
  name: 'demo-record-page-fields',
  objectUniversalIdentifier: 'b93b6468-40b4-4555-9541-d59a854c46da',
  type: 'FIELDS_WIDGET',
  icon: 'IconList',
  position: 0,
  fields: [
  {
    universalIdentifier: 'f2d2aab9-e363-4900-9c64-1a552aac5904',
    fieldMetadataUniversalIdentifier: 'f3726264-44b2-45c7-b3ec-2d6d366e6a14',
    position: 0,
    isVisible: true,
    size: 200,
  },
  {
    universalIdentifier: 'af1ba80a-0a17-41c7-bf25-5bcf39782618',
    fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({
      applicationUniversalIdentifier: 'cfdfcebe-c9d2-4a51-b81b-777bb77fc140',
      objectUniversalIdentifier: 'b93b6468-40b4-4555-9541-d59a854c46da',
      fieldName: 'createdAt',
    }),
    position: 1,
    isVisible: true,
    size: 200,
  },
  {
    universalIdentifier: '97235e98-9abb-443c-924a-5ff6a629e86a',
    fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({
      applicationUniversalIdentifier: 'cfdfcebe-c9d2-4a51-b81b-777bb77fc140',
      objectUniversalIdentifier: 'b93b6468-40b4-4555-9541-d59a854c46da',
      fieldName: 'updatedAt',
    }),
    position: 2,
    isVisible: true,
    size: 200,
  },
  {
    universalIdentifier: '2d66cbe6-8650-4a0a-b176-d300a30a2da2',
    fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({
      applicationUniversalIdentifier: 'cfdfcebe-c9d2-4a51-b81b-777bb77fc140',
      objectUniversalIdentifier: 'b93b6468-40b4-4555-9541-d59a854c46da',
      fieldName: 'createdBy',
    }),
    position: 3,
    isVisible: true,
    size: 200,
  },
  {
    universalIdentifier: '208833eb-2b77-4704-870b-4dd9cd6b7854',
    fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({
      applicationUniversalIdentifier: 'cfdfcebe-c9d2-4a51-b81b-777bb77fc140',
      objectUniversalIdentifier: 'b93b6468-40b4-4555-9541-d59a854c46da',
      fieldName: 'updatedBy',
    }),
    position: 4,
    isVisible: true,
    size: 200,
  },
  ],
  // filters: [
  //   {
  //     universalIdentifier: '...',
  //     fieldMetadataUniversalIdentifier: '...',
  //     operand: 'Contains',
  //     value: '',
  //   },
  // ],
  // sorts: [
  //   {
  //     universalIdentifier: '...',
  //     fieldMetadataUniversalIdentifier: '...',
  //     direction: 'DESC',
  //   },
  // ],
});
