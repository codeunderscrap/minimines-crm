import { defineObject, FieldType } from 'twenty-sdk/define';
import { OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineObject({
  nameSingular: 'bdOpportunity',
  namePlural: 'bdOpportunities',
  labelSingular: 'Opportunity',
  labelPlural: 'Opportunities',
  universalIdentifier: OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
  description: 'Active BD deals converted from leads, tracking requirements and negotiations.',
  icon: 'IconTarget',
  labelIdentifierFieldMetadataUniversalIdentifier: 'c4da7b23-1c32-4d56-8a9d-b841accd5f48',
  fields: [
    {
      universalIdentifier: 'c4da7b23-1c32-4d56-8a9d-b841accd5f48',
      name: 'name',
      type: FieldType.TEXT,
      label: 'Opportunity Name',
    },
    {
      universalIdentifier: '7f918e6c-3e3d-4c31-8f5b-9a4d87a6c9d2',
      name: 'linkedLeadId',
      type: FieldType.TEXT,
      label: 'Linked Lead ID',
    },
    {
      universalIdentifier: 'b2a164c9-b75d-4680-8525-0a19f04ec0e4',
      name: 'companyName',
      type: FieldType.TEXT,
      label: 'Company Name',
    },
    {
      universalIdentifier: 'c4a9818e-4ad2-46af-9536-fcbb5a37f8a4',
      name: 'dealValue',
      type: FieldType.NUMBER,
      label: 'Expected Value ($)',
    },
    {
      universalIdentifier: '920d71c8-ff98-465e-a2d6-234531ba3858',
      name: 'stage',
      type: FieldType.SELECT,
      label: 'Pipeline Stage',
      options: [
        { label: 'Requirements Gathering', value: 'REQUIREMENTS', position: 0, color: 'blue' },
        { label: 'Negotiation', value: 'NEGOTIATION', position: 1, color: 'yellow' },
        { label: 'Won (Ready for Order)', value: 'WON', position: 2, color: 'green' },
        { label: 'Lost', value: 'LOST', position: 3, color: 'red' },
      ],
      defaultValue: "'REQUIREMENTS'",
    },
    {
      universalIdentifier: '0739daf4-5a5d-4fed-9132-fef2eb371100',
      name: 'requirements',
      type: FieldType.TEXT,
      label: 'Client Requirements',
    },
  ],
});
