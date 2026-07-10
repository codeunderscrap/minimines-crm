import { defineObject, defineField } from 'twenty-sdk/define';

export default defineObject({
  nameSingular: 'ExportShipment',
  namePlural: 'ExportShipments',
  labelSingular: 'Export Shipment',
  labelPlural: 'Export Shipments',
  description: 'Logistics tracking for export orders',
  fields: {
    vesselName: defineField.text({ label: 'Vessel Name' }),
    containerNumber: defineField.text({ label: 'Container Number' }),
    shipmentDate: defineField.dateTime({ label: 'Shipment Date' }),
    salesOrderId: defineField.relation({ label: 'Sales Order', object: 'SalesOrder' }),
    qaStatus: defineField.select({
      label: 'QA Status',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Passed', value: 'PASSED' },
        { label: 'Failed', value: 'FAILED' }
      ]
    }),
    documentationStatus: defineField.select({
      label: 'Documentation Status',
      options: [
        { label: 'Incomplete', value: 'INCOMPLETE' },
        { label: 'Ready', value: 'READY' }
      ]
    })
  }
});
