import { defineApplicationRole } from 'twenty-sdk/define';



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

export default defineApplicationRole({
  universalIdentifier: 'a4428a8a-f29b-4d4c-907f-3898ee87904b',
  label: 'HOD',
  description: 'Head of Department — full access across Sales and BD, plus the only tier that manages roles, reporting lines, and combination dashboards.',
  canBeAssignedToUsers: true,
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
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
    { objectUniversalIdentifier: '2d76ead8-21ea-4c17-bbbb-6f511175ebeb', ...FULL_ACCESS },
    { objectUniversalIdentifier: 'e8f2d4a6-1b3c-4f7e-9d5a-2c6b8a4f1e3d', ...FULL_ACCESS },
  ],
});
