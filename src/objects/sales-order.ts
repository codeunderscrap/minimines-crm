import { defineObject, FieldType } from 'twenty-sdk/define';

export default defineObject({
  universalIdentifier: '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0',
  nameSingular: 'salesOrder',
  namePlural: 'salesOrders',
  labelSingular: 'Sales Order',
  labelPlural: 'Sales Orders',
  description: 'Specific order linked to a contract',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f22281aa',
  fields: [
    { universalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f22281aa', name: 'name', type: FieldType.TEXT, label: 'Order Name' },
    { universalIdentifier: 'd45b1a20-3b99-4c22-b7e2-45e0f22281bb', name: 'orderNumber', type: FieldType.TEXT, label: 'Order Number' },
    { universalIdentifier: 'e56b1a20-3b99-4c22-b7e2-45e0f22281cc', name: 'orderDate', type: FieldType.DATE_TIME, label: 'Order Date' },
    { universalIdentifier: 'f67b1a20-3b99-4c22-b7e2-45e0f22281dd', name: 'quantity', type: FieldType.NUMBER, label: 'Quantity (MT)' },
    { universalIdentifier: 'a78b1a20-3b99-4c22-b7e2-45e0f22281ee', name: 'contractId', type: FieldType.TEXT, label: 'Contract ID' },
    {
      universalIdentifier: 'b89b1a20-3b99-4c22-b7e2-45e0f22281ff',
      name: 'fulfillmentStatus',
      type: FieldType.SELECT,
      label: 'Fulfillment Status',
      options: [
        { position: 0, label: 'Pending', value: 'PENDING' },
        { position: 1, label: 'In Progress', value: 'IN_PROGRESS' },
        { position: 2, label: 'Shipped', value: 'SHIPPED' }
      ]
    }
  ]
});
