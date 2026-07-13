import { defineObject, FieldType } from 'twenty-sdk/define';
import { PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineObject({
  universalIdentifier: PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'product',
  namePlural: 'products',
  labelSingular: 'Product Master',
  labelPlural: 'Product Master',
  description: 'Catalog of materials, battery salts, and by-products.',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: 'ec4924d8-0935-4888-be9f-bfbcebe5ee48',
  fields: [
    { universalIdentifier: 'ec4924d8-0935-4888-be9f-bfbcebe5ee48', name: 'sku', type: FieldType.TEXT, label: 'SKU / Material Code' },
    { universalIdentifier: 'e3830988-316d-4022-a8a7-c3f7d65c99a8', name: 'materialName', type: FieldType.TEXT, label: 'Material Name' },
    {
      universalIdentifier: 'b24403b1-e0c2-4a92-b9b4-4a04d19d1aa1',
      name: 'category',
      type: FieldType.SELECT,
      label: 'Category',
      options: [
        { position: 0, color: 'blue', label: 'Battery Material', value: 'BATTERY_MATERIAL' },
        { position: 1, color: 'orange', label: 'By-Product', value: 'BY_PRODUCT' },
        { position: 2, color: 'gray', label: 'Raw Material', value: 'RAW_MATERIAL' },
      ]
    },
    { universalIdentifier: 'f2bd7716-9bdb-4640-b0f3-b59c93e30dbc', name: 'baseComposition', type: FieldType.TEXT, label: 'Base Composition Specs' },
    { universalIdentifier: '2663d562-c580-4085-a2ad-56888a52a756', name: 'targetLmeLinkage', type: FieldType.TEXT, label: 'Target LME Linkage' },
    { universalIdentifier: '98e74564-3ff4-48f3-bc35-2f38cc2abf85', name: 'isAvailableForDomesticSale', type: FieldType.BOOLEAN, label: 'Available for Domestic Sale' }
  ]
});
