import { defineRole, RowLevelPermissionPredicateOperand, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';
import {
  ASSOCIATE_ROLE_UNIVERSAL_IDENTIFIER,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_ASSOCIATE_FIELD_UNIVERSAL_IDENTIFIER,
  ASSOCIATE_ROLE_OWNERSHIP_PREDICATE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const WORKSPACE_MEMBER = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember;

/**
 * Associate — bottom tier of HOD -> Manager -> Associate. Least-privilege
 * by default: no blanket access, just Lead (their working object) with
 * read/update, no delete, and row-level-scoped to leads assigned to them
 * specifically. The department-dashboard restriction is a sidebar/UI
 * concern, not a permission — handled by which nav items an Associate's
 * account has, not by this role. Per-named-person field masking (§6 of
 * the proposal) is a later, custom addition on top of this, not a native
 * role permission.
 */
export default defineRole({
  universalIdentifier: ASSOCIATE_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Associate',
  description: 'Works leads handed down by their Manager. Scoped to their own department and their own assigned leads only.',
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
  ],
  fieldPermissions: [],
  // "Only leads assigned to me" — Lead.assignedAssociate IS the
  // current workspace member.
  rowLevelPermissionPredicates: [
    {
      universalIdentifier: ASSOCIATE_ROLE_OWNERSHIP_PREDICATE_UNIVERSAL_IDENTIFIER,
      objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: LEAD_ASSIGNED_ASSOCIATE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: RowLevelPermissionPredicateOperand.IS,
      workspaceMemberFieldUniversalIdentifier: WORKSPACE_MEMBER.fields.id.universalIdentifier,
    },
  ],
});
