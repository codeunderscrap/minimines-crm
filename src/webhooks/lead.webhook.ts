import { defineWebhook } from 'twenty-sdk/define';
import { LEAD_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

/**
 * Twenty CRM will POST directly to SalesHub's /api/twenty-webhook endpoint
 * whenever a Lead is created or updated.
 *
 * Set the SALESHUB_WEBHOOK_URL env var to your Render deployment URL, e.g.:
 *   SALESHUB_WEBHOOK_URL=https://saleshub-xxxx.onrender.com/api/twenty-webhook
 */
export default defineWebhook({
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  events: ['created', 'updated'],
  url: process.env.SALESHUB_WEBHOOK_URL || 'http://localhost:8000/api/twenty-webhook',
});
