import {
  defineRole,
  RowLevelPermissionPredicateOperand,
  RowLevelPermissionPredicateGroupLogicalOperator,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


const WORKSPACE_MEMBER = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember;

// Objects that don't yet export a named constant (defined inline in their
// own object files) — kept here rather than touching those files.
const CONTRACT_OBJECT_UNIVERSAL_IDENTIFIER = '651890c3-6208-429c-8e72-3e99adeb480e';
const SALES_ORDER_OBJECT_UNIVERSAL_IDENTIFIER = '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0';
const EXPORT_SHIPMENT_OBJECT_UNIVERSAL_IDENTIFIER = '04acd819-f079-4dde-b36d-1eb14b47167d';
const LME_TRACKER_OBJECT_UNIVERSAL_IDENTIFIER = '03987302-22c9-4308-a280-e16738c722af';

const FULL_ACCESS = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: true,
  canSoftDeleteObjectRecords: true,
  canDestroyObjectRecords: false,
};

/**
 * Manager — middle tier of HOD -> Manager -> Associate. Full parity with
 * HOD on every object EXCEPT Lead, which is row-level scoped to "my team"
 * (Aditya reports to two Managers at once, so the rule is an OR group:
 * assignedManagerPrimary IS me OR assignedManagerSecondary IS me).
 *
 * Deliberately NOT using the blanket canReadAllObjectRecords-style flags:
 * Twenty's own docs never combine those with rowLevelPermissionPredicates
 * in their examples, so to be safe this grants full access per-object
 * instead, which is documented to work alongside row-level rules.
 */
export default defineRole({
  universalIdentifier: '4d016af4-8707-49b2-8f6c-0de2ba1d4d28',
  label: 'Manager',
  description: 'Manages a team of Associates. Full module access, same footing as HOD, except leads are scoped to their own team.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    { objectUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645', ...FULL_ACCESS },
    { objectUniversalIdentifier: '60b1d481-b270-4fea-896e-df5d49279735', ...FULL_ACCESS },
    { objectUniversalIdentifier: 'eb3a7200-27aa-42d9-9271-24b70ff8a255', ...FULL_ACCESS },
    { objectUniversalIdentifier: '71ba2bb5-f601-40b0-ba63-3dab06028c57', ...FULL_ACCESS },
    { objectUniversalIdentifier: '89f006c5-0854-488a-9a8c-750974c8a222', ...FULL_ACCESS },
    { objectUniversalIdentifier: CONTRACT_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: SALES_ORDER_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: EXPORT_SHIPMENT_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
    { objectUniversalIdentifier: 'df236eba-da40-419a-abb7-2f2fc0f8d2ab', ...FULL_ACCESS },
    { objectUniversalIdentifier: LME_TRACKER_OBJECT_UNIVERSAL_IDENTIFIER, ...FULL_ACCESS },
  ],
  fieldPermissions: [],
  rowLevelPermissionPredicateGroups: [
    {
      universalIdentifier: '3be78f21-3074-4add-8bcd-e85b64c912c5',
      objectUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
      logicalOperator: RowLevelPermissionPredicateGroupLogicalOperator.OR,
    },
  ],
  rowLevelPermissionPredicates: [
    {
      universalIdentifier: 'cebebedd-978b-43aa-9bbb-795510822ca0',
      objectUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
      fieldUniversalIdentifier: 'f64b6578-3781-48af-a80a-2109d738f07a',
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: WORKSPACE_MEMBER.fields.id.universalIdentifier,
      predicateGroupUniversalIdentifier: '3be78f21-3074-4add-8bcd-e85b64c912c5',
    },
    {
      universalIdentifier: '0b31d6da-0ba6-47d4-97ad-367e1b703e99',
      objectUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
      fieldUniversalIdentifier: '297abbb4-fbea-4725-a31c-56d353f2ad06',
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: WORKSPACE_MEMBER.fields.id.universalIdentifier,
      predicateGroupUniversalIdentifier: '3be78f21-3074-4add-8bcd-e85b64c912c5',
    },
  ],
});
