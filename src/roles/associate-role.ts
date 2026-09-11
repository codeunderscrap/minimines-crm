import { defineRole, RowLevelPermissionPredicateOperand, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';


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
  universalIdentifier: '0a43c88f-751d-49a0-9406-6eebaafaf9bd',
  label: 'Associate',
  description: 'Works leads handed down by their Manager. Scoped to their own department and their own assigned leads only. Has access to pipeline, quotations, contracts, shipments, and compliance tracking.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    {
      objectUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    { objectUniversalIdentifier: 'eb3a7200-27aa-42d9-9271-24b70ff8a255', ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: '71ba2bb5-f601-40b0-ba63-3dab06028c57', ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: '60b1d481-b270-4fea-896e-df5d49279735', ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: 'df236eba-da40-419a-abb7-2f2fc0f8d2ab', ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: CONTRACT_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: SALES_ORDER_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
    { objectUniversalIdentifier: EXPORT_SHIPMENT_OBJECT_UNIVERSAL_IDENTIFIER, ...ASSOCIATE_ACCESS },
  ],
  fieldPermissions: [],
  // "Only leads assigned to me" — Lead.assignedAssociate IS the
  // current workspace member.
  rowLevelPermissionPredicates: [],
});
