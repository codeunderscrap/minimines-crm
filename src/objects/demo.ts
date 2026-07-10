import { defineObject, FieldType } from 'twenty-sdk/define';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  'f3726264-44b2-45c7-b3ec-2d6d366e6a14';

export default defineObject({
  universalIdentifier: 'b93b6468-40b4-4555-9541-d59a854c46da',
  nameSingular: 'Demo',
  namePlural: 'DemoDemos',
  labelSingular: 'Demos',
  labelPlural: 'Demo',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the Demo',
      icon: 'IconAbc',
    },
  ],
});
