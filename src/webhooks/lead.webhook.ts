import { defineWebhook } from 'twenty-sdk/define';
import { LEAD_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

/**
 * Twenty CRM will POST directly to SalesHub's /api/twenty-webhook endpoint
 * whenever a Lead is created or updated.
 */
export default defineWebhook({
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  events: ['created', 'updated'],
  url: 'https://attplatfrom.onrender.com/api/twenty-webhook',
});
