import { defineRole } from 'twenty-sdk/define';
import {
  ASSOCIATE_ROLE_UNIVERSAL_IDENTIFIER,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

/**
 * Associate — bottom tier of HOD -> Manager -> Associate. Least-privilege
 * by default: no blanket access, just Lead (their working object) with
 * read/update, no delete. Ownership scoping ("only leads assigned to me")
 * and the department dashboard restriction are added once
 * Lead.assignedAssociate and the Department field exist (next stages) —
 * a row-level predicate can't reference a field that isn't defined yet.
 * Per-named-person field masking (§6 of the proposal) is a later, custom
 * addition on top of this, not a native role permission.
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
});
