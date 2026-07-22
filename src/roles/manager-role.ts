import {
  defineRole,
  RowLevelPermissionPredicateOperand,
  RowLevelPermissionPredicateGroupLogicalOperator,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  MANAGER_ROLE_UNIVERSAL_IDENTIFIER,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_PRIMARY_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_SECONDARY_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  EXPORT_DOCUMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER,
  QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
  MANAGER_ROLE_TEAM_PREDICATE_GROUP_UNIVERSAL_IDENTIFIER,
  MANAGER_ROLE_TEAM_PREDICATE_PRIMARY_UNIVERSAL_IDENTIFIER,
  MANAGER_ROLE_TEAM_PREDICATE_SECONDARY_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

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
  universalIdentifier: MANAGER_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Manager',
  description: 'Manages a team of Associates. Full module access, same footing as HOD, except leads are scoped to their own team.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
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
  ],
  fieldPermissions: [],
  rowLevelPermissionPredicateGroups: [
    {
      universalIdentifier: MANAGER_ROLE_TEAM_PREDICATE_GROUP_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      logicalOperator: RowLevelPermissionPredicateGroupLogicalOperator.OR,
    },
  ],
  rowLevelPermissionPredicates: [
    {
      universalIdentifier: MANAGER_ROLE_TEAM_PREDICATE_PRIMARY_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: LEAD_ASSIGNED_MANAGER_PRIMARY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: WORKSPACE_MEMBER.fields.id.universalIdentifier,
      predicateGroupUniversalIdentifier: MANAGER_ROLE_TEAM_PREDICATE_GROUP_UNIVERSAL_IDENTIFIER,
    },
    {
      universalIdentifier: MANAGER_ROLE_TEAM_PREDICATE_SECONDARY_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: LEAD_ASSIGNED_MANAGER_SECONDARY_FIELD_UNIVERSAL_IDENTIFIER,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: WORKSPACE_MEMBER.fields.id.universalIdentifier,
      predicateGroupUniversalIdentifier: MANAGER_ROLE_TEAM_PREDICATE_GROUP_UNIVERSAL_IDENTIFIER,
    },
  ],
});
