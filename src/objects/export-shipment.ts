import { defineObject, FieldType } from 'twenty-sdk/define';

export default defineObject({
  universalIdentifier: '04acd819-f079-4dde-b36d-1eb14b47167d',
  nameSingular: 'ExportShipment',
  namePlural: 'ExportShipments',
  labelSingular: 'Export Shipment',
  labelPlural: 'Export Shipments',
  description: 'Logistics tracking for export orders',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f33381aa',
  fields: [
    { universalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f33381aa', name: 'name', type: FieldType.TEXT, label: 'Shipment Name' },
    { universalIdentifier: 'd45b1a20-3b99-4c22-b7e2-45e0f33381bb', name: 'vesselName', type: FieldType.TEXT, label: 'Vessel Name' },
    { universalIdentifier: 'e56b1a20-3b99-4c22-b7e2-45e0f33381cc', name: 'containerNumber', type: FieldType.TEXT, label: 'Container Number' },
    { universalIdentifier: 'f67b1a20-3b99-4c22-b7e2-45e0f33381dd', name: 'shipmentDate', type: FieldType.DATE_TIME, label: 'Shipment Date' },
    { universalIdentifier: 'a78b1a20-3b99-4c22-b7e2-45e0f33381ee', name: 'salesOrderId', type: FieldType.TEXT, label: 'Sales Order ID' },
    {
      universalIdentifier: 'b89b1a20-3b99-4c22-b7e2-45e0f33381ff',
      name: 'qaStatus',
      type: FieldType.SELECT,
      label: 'QA Status',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Passed', value: 'PASSED' },
        { label: 'Failed', value: 'FAILED' }
      ]
    },
    {
      universalIdentifier: 'c90b1a20-3b99-4c22-b7e2-45e0f3338100',
      name: 'documentationStatus',
      type: FieldType.SELECT,
      label: 'Documentation Status',
      options: [
        { label: 'Incomplete', value: 'INCOMPLETE' },
        { label: 'Ready', value: 'READY' }
      ]
    }
  ]
});
