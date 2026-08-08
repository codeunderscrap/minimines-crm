import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineField({
  universalIdentifier: 'd5c5cf87-47d8-4499-8014-58e4786c2be2',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'opportunitys',
  label: 'Opportunitys',
  relationTargetObjectMetadataUniversalIdentifier: OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: '5f504f3e-8e13-4009-a753-52a9028158bd',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
