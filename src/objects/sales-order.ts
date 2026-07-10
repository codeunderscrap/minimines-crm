import { defineObject, defineField } from 'twenty-sdk/define';

export default defineObject({
  nameSingular: 'SalesOrder',
  namePlural: 'SalesOrders',
  labelSingular: 'Sales Order',
  labelPlural: 'Sales Orders',
  description: 'Specific order linked to a contract',
  fields: {
    orderNumber: defineField.text({ label: 'Order Number' }),
    orderDate: defineField.dateTime({ label: 'Order Date' }),
    quantity: defineField.number({ label: 'Quantity (MT)' }),
    contractId: defineField.relation({ label: 'Contract', object: 'Contract' }),
    fulfillmentStatus: defineField.select({
      label: 'Fulfillment Status',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Shipped', value: 'SHIPPED' }
      ]
    })
  }
});
