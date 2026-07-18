import { defineObject, FieldType } from 'twenty-sdk/define';
import { QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineObject({
  universalIdentifier: QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'quotation',
  namePlural: 'quotations',
  labelSingular: 'Quotation (Domestic)',
  labelPlural: 'Quotations (Domestic)',
  description: 'Manage domestic sales quotes and multi-item orders.',
  icon: 'IconReceipt',
  labelIdentifierFieldMetadataUniversalIdentifier: '0c0fe0ec-93aa-4c3c-aeaf-d891d8a03981',
  fields: [
    { universalIdentifier: '0c0fe0ec-93aa-4c3c-aeaf-d891d8a03981', name: 'quoteNumber', type: FieldType.TEXT, label: 'Quote Number' },
    { universalIdentifier: '79b1cf3d-60df-4cd9-9fa7-9d96922569cb', name: 'buyerCompanyId', type: FieldType.TEXT, label: 'Buyer Company ID' },
    { universalIdentifier: 'b9cd4ab3-d101-473e-a621-a999f268b00f', name: 'productId', type: FieldType.TEXT, label: 'Product ID' },
    { universalIdentifier: 'a93ea01d-63c2-4a98-9dc6-368b903ff6bc', name: 'quantity', type: FieldType.NUMBER, label: 'Quantity (MT)' },
    { universalIdentifier: '310a84ba-5e4a-48a9-964d-432d55829457', name: 'proposedRate', type: FieldType.CURRENCY, label: 'Proposed Rate (INR)' },
    {
      universalIdentifier: '51178cdf-3bd7-4fab-b52f-2144e95ac502',
      name: 'approvalStatus',
      type: FieldType.SELECT,
      label: 'Approval Status',
      options: [
        { position: 0, color: 'gray', label: 'Draft', value: 'DRAFT' },
        { position: 1, color: 'orange', label: 'HOD Review', value: 'HOD_REVIEW' },
        { position: 2, color: 'green', label: 'CEO Approved', value: 'CEO_APPROVED' },
        { position: 3, color: 'blue', label: 'Converted to Order', value: 'CONVERTED_TO_ORDER' },
        { position: 4, color: 'red', label: 'Rejected', value: 'REJECTED' },
      ]
    }
  ]
});
