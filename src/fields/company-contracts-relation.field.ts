import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
const 651890c3-6208-429c-8e72-3e99adeb480e_CONST = '651890c3-6208-429c-8e72-3e99adeb480e';

export default defineField({
  universalIdentifier: '90744c6d-676e-4830-b6be-4790c0616b70',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'contracts',
  label: 'Contracts',
  relationTargetObjectMetadataUniversalIdentifier: 651890c3-6208-429c-8e72-3e99adeb480e_CONST,
  relationTargetFieldMetadataUniversalIdentifier: '71bca3fa-1366-476d-8b19-e07f2b59f5c6',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
