import { defineObject, FieldType } from 'twenty-sdk/define';
import { LEAD_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineObject({
  nameSingular: 'lead',
  namePlural: 'leads',
  labelSingular: 'Lead',
  labelPlural: 'Leads',
  universalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  description: 'A prospect lead captured from website, LinkedIn, calls, or direct sources.',
  icon: 'IconUserPlus',
  labelIdentifierFieldMetadataUniversalIdentifier: '12b90fc3-ebff-4269-a4f1-ec1d1634aad7',
  fields: [
    {
      universalIdentifier: '12b90fc3-ebff-4269-a4f1-ec1d1634aad7',
      name: 'name',
      type: FieldType.TEXT,
      label: 'Lead Name',
    },
    {
      universalIdentifier: '3c5dbbb2-5915-4e16-bb7c-61cdab1a628d',
      name: 'company',
      type: FieldType.TEXT,
      label: 'Company / Organization',
    },
    {
      universalIdentifier: 'b21064a2-b73d-4680-8525-0a19f04ec0e4',
      name: 'email',
      type: FieldType.EMAILS,
      label: 'Email',
    },
    {
      universalIdentifier: 'ddc9818e-4ad2-46af-9536-fcbb5a37f8a4',
      name: 'phone',
      type: FieldType.PHONES,
      label: 'Phone Number',
    },
    {
      universalIdentifier: '620d71c8-ff98-465e-a2d6-234531ba3858',
      name: 'source',
      type: FieldType.SELECT,
      label: 'Lead Source',
      options: [
        { label: 'Website (WordPress)', value: 'WEBSITE', position: 0, color: 'blue' },
        { label: 'LinkedIn', value: 'LINKEDIN', position: 1, color: 'sky' },
        { label: 'Call', value: 'CALL', position: 2, color: 'green' },
        { label: 'Direct', value: 'DIRECT', position: 3, color: 'gray' },
        { label: 'SalesHub', value: 'SALESHUB', position: 4, color: 'purple' },
      ],
    },
    {
      universalIdentifier: '0739daf4-5a5d-4fed-9132-fef2eb371192',
      name: 'status',
      type: FieldType.SELECT,
      label: 'Status',
      options: [
        { label: 'New', value: 'NEW', position: 0, color: 'sky' },
        { label: 'Contacted', value: 'CONTACTED', position: 1, color: 'yellow' },
        { label: 'Qualified', value: 'QUALIFIED', position: 2, color: 'green' },
        { label: 'Disqualified', value: 'DISQUALIFIED', position: 3, color: 'red' },
      ],
    },
    {
      universalIdentifier: 'd584e26d-46a1-4181-b54d-cfae9849ac8d',
      name: 'assignedTo',
      type: FieldType.SELECT,
      label: 'Assigned Executive',
      options: [
        { label: 'Unassigned', value: 'UNASSIGNED', position: 0, color: 'gray' },
        { label: 'Manish', value: 'MANISH', position: 1, color: 'blue' },
        { label: 'Executive 1', value: 'EXECUTIVE_1', position: 2, color: 'green' },
        { label: 'Executive 2', value: 'EXECUTIVE_2', position: 3, color: 'purple' },
      ],
    },
    {
      universalIdentifier: 'ab3b68ff-a256-474f-a59d-c148ba58a602',
      name: 'notes',
      type: FieldType.TEXT,
      label: 'Internal Notes',
    },
    {
      universalIdentifier: '820464be-4131-482a-a9e9-d7b4db1b4432',
      name: 'convertedToOpportunityId',
      type: FieldType.TEXT,
      label: 'Converted To Opportunity ID',
    },
    {
      universalIdentifier: '368e7b51-512c-47bc-ad7f-d38a83ed1fbc',
      name: 'followUpStatus',
      type: FieldType.SELECT,
      label: 'Follow Up Status',
      options: [
        { label: 'None', value: 'NONE', position: 0, color: 'gray' },
        { label: 'Follow Up 1', value: 'FOLLOW_UP_1', position: 1, color: 'yellow' },
        { label: 'Follow Up 2', value: 'FOLLOW_UP_2', position: 2, color: 'orange' },
        { label: 'Follow Up 3', value: 'FOLLOW_UP_3', position: 3, color: 'red' },
      ],
    },
    {
      universalIdentifier: '9bdde85a-038b-4b2a-8884-6330ce1484f1',
      name: 'acknowledgmentSent',
      type: FieldType.BOOLEAN,
      label: 'Acknowledgment Sent',
    },
  ],
});

