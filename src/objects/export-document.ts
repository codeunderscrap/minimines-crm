import { defineObject, FieldType } from 'twenty-sdk/define';
import { EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineObject({
  universalIdentifier: EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'exportDocument',
  namePlural: 'exportDocuments',
  labelSingular: 'Export Document',
  labelPlural: 'Export Documents',
  description: 'Manage 8+ export declarations (EVD, FEMA, SCOMET, HSN, etc.)',
  icon: 'IconFiles',
  labelIdentifierFieldMetadataUniversalIdentifier: '97e3ba9b-164a-4f94-b71f-2c44b87c45e3',
  fields: [
    {
      universalIdentifier: '97e3ba9b-164a-4f94-b71f-2c44b87c45e3',
      name: 'documentType',
      type: FieldType.SELECT,
      label: 'Document Type',
      options: [
        { position: 0, color: 'blue', label: 'EVD', value: 'EVD' },
        { position: 1, color: 'blue', label: 'FEMA', value: 'FEMA' },
        { position: 2, color: 'blue', label: 'SCOMET', value: 'SCOMET' },
        { position: 3, color: 'blue', label: 'HSN Declaration', value: 'HSN' },
        { position: 4, color: 'blue', label: 'Packing Note', value: 'PACKING_NOTE' },
        { position: 5, color: 'blue', label: 'E-Way Bill', value: 'E_WAY_BILL' },
        { position: 6, color: 'blue', label: 'Shipping Bill', value: 'SHIPPING_BILL' },
        { position: 7, color: 'gray', label: 'Other', value: 'OTHER' },
      ]
    },
    { universalIdentifier: '190fc813-5a7c-4290-ae7f-c42353e1d9ab', name: 'exportShipmentId', type: FieldType.TEXT, label: 'Export Shipment ID' },
    {
      universalIdentifier: '58ef4646-862d-465b-b81c-df09f30ac43a',
      name: 'status',
      type: FieldType.SELECT,
      label: 'Status',
      options: [
        { position: 0, color: 'orange', label: 'Pending Preparation', value: 'PENDING' },
        { position: 1, color: 'blue', label: 'Prepared & Signed', value: 'PREPARED' },
        { position: 2, color: 'green', label: 'Submitted to CHA', value: 'SUBMITTED' },
      ]
    },
    { universalIdentifier: '45ef2116-2870-4803-aea8-2ff551d965fc', name: 'targetDate', type: FieldType.DATE_TIME, label: 'Target Completion Date' },
  ]
});
