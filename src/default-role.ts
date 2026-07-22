import { defineApplicationRole } from 'twenty-sdk/define';

import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

/**
 * HOD (Head of Department) — top tier of the HOD -> Manager -> Associate
 * hierarchy. Twenty only allows one defineApplicationRole per app, so this
 * is that single slot; Manager and Associate are added as plain defineRole
 * entries in src/roles/.
 */
export default defineApplicationRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'HOD',
  description: 'Head of Department — full access across Sales and BD, plus the only tier that manages roles, reporting lines, and combination dashboards.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
});
