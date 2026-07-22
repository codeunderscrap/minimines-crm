import { defineRole } from 'twenty-sdk/define';
import { MANAGER_ROLE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

/**
 * Manager — middle tier of HOD -> Manager -> Associate. Full parity with
 * HOD on object/field access for now (per instruction, narrow later);
 * the "only see my team's leads" row-level restriction is added once
 * Lead.assignedManagerIds exists (next stage — needs the reporting-line
 * data model in place first so the predicate has a field to reference).
 */
export default defineRole({
  universalIdentifier: MANAGER_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Manager',
  description: 'Manages a team of Associates. Full module access for now, same footing as HOD; will be scoped to their own team\'s leads once reporting lines are in place.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
  objectPermissions: [],
  fieldPermissions: [],
});
