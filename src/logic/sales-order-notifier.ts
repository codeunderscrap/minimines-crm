import { defineLogicFunction } from 'twenty-sdk/define';

export default defineLogicFunction({
  name: 'notifyAccountsOnSalesOrder',
  description: 'Triggers a webhook notification to Accounts when a Sales Order is created',
  input: {
    salesOrderId: { type: 'string' }
  },
  output: {
    success: { type: 'boolean' }
  },
  async execute({ input, context }) {
    // 1. Fetch Sales Order
    const salesOrder = await context.api.findOne('salesOrders', input.salesOrderId);
    if (!salesOrder) throw new Error('Sales Order not found');

    // 2. Mock: Send data to external ERP / Accounts Webhook
    // In production, context.fetch or external HTTP client would be used to trigger the external system
    const erpWebhookUrl = process.env.ERP_WEBHOOK_URL || 'https://api.minimines.erp/webhook/sales';
    
    console.log(`[Webhook] Notifying Accounts system at ${erpWebhookUrl} about SalesOrder ${salesOrder.orderNumber}`);
    
    // Simulate HTTP request
    // await fetch(erpWebhookUrl, { method: 'POST', body: JSON.stringify(salesOrder) })

    return { success: true };
  }
});
