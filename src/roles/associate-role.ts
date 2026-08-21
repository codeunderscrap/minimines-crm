import { defineRole, RowLevelPermissionPredicateOperand, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';
import {
  ASSOCIATE_ROLE_UNIVERSAL_IDENTIFIER,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_ASSOCIATE_FIELD_UNIVERSAL_IDENTIFIER,
  ASSOCIATE_ROLE_OWNERSHIP_PREDICATE_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
  QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const WORKSPACE_MEMBER = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember;

// Objects defined inline or in their own files
const CONTRACT_OBJECT_UNIVERSAL_IDENTIFIER = '651890c3-6208-429c-8e72-3e99adeb480e';
const SALES_ORDER_OBJECT_UNIVERSAL_IDENTIFIER = '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0';
const EXPORT_SHIPMENT_OBJECT_UNIVERSAL_IDENTIFIER = '04acd819-f079-4dde-b36d-1eb14b47167d';

const ASSOCIATE_ACCESS = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: true,
  canSoftDeleteObjectRecords: false,
  canDestroyObjectRecords: false,
};

/**
 * Associate — bottom tier of HOD -> Manager -> Associate. 
 * Lead permissions are row-level scoped to "leads assigned to me".
 * Other modules (Opportunity, Quotation, Contract, Shipment, Enquiry, Export, Sales)
 * have direct read/update access.
 */
export default defineRole({
  universalIdentifier: ASSOCIATE_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Associate',
  description: 'Works leads handed down by their Manager. Scoped to their own department and their own assigned leads only. Has access to pipeline, quotations, contracts, shipments, and compliance tracking.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    {
      objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    { objectUniversalIdentifier: OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: CONTRACT_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: SALES_ORDER_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: EXPORT_SHIPMENT_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
  ],
  fieldPermissions: [],
  // "Only leads assigned to me" — Lead.assignedAssociate IS the
  // current workspace member.
  rowLevelPermissionPredicates: [],
});
