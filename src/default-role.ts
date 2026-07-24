import { defineApplicationRole } from 'twenty-sdk/define';

import {
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER,
  QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const CONTRACT_OBJECT_UNIVERSAL_IDENTIFIER = '651890c3-6208-429c-8e72-3e99adeb480e';
const SALES_ORDER_OBJECT_UNIVERSAL_IDENTIFIER = '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0';
const EXPORT_SHIPMENT_OBJECT_UNIVERSAL_IDENTIFIER = '04acd819-f079-4dde-b36d-1eb14b47167d';
const LME_TRACKER_OBJECT_UNIVERSAL_IDENTIFIER = '03987302-22c9-4308-a280-e16738c722af';
const CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER = 'e8f2d4a6-1b3c-4f7e-9d5a-2c6b8a4f1e3d';

const FULL_ACCESS = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: true,
  canSoftDeleteObjectRecords: true,
  canDestroyObjectRecords: false,
};

export default defineApplicationRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'HOD',
  description: 'Head of Department — full access across Sales and BD, plus the only tier that manages roles, reporting lines, and combination dashboards.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: CONTRACT_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: SALES_ORDER_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: EXPORT_SHIPMENT_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: LME_TRACKER_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
  ],
});
