import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'fc53ec71-6649-498e-a9a9-5884cf567a89',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'salesOrders',
  label: 'Salesorders',
  relationTargetObjectMetadataUniversalIdentifier: '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0',
  relationTargetFieldMetadataUniversalIdentifier: '6b9f3b5e-ba64-43b8-ab88-7cd06c240f95',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
