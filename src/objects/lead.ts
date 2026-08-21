import {
  defineObject,
  FieldType,
  RelationType,
  OnDeleteAction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_ASSOCIATE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_ASSOCIATE_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_PRIMARY_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_PRIMARY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_SECONDARY_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_SECONDARY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

const WORKSPACE_MEMBER = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember;

export default defineObject({
  nameSingular: 'lead',
  namePlural: 'leads',
  labelSingular: 'Lead',
  labelPlural: 'Leads',
  universalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  description: 'A prospect lead captured from website, LinkedIn, calls, or direct sources.',
  icon: 'IconUserPlus',
  labelIdentifierFieldMetadataUniversalIdentifier: '12b90fc3-ebff-4269-a4f1-ec1d1634aad7',
  fields: [
    {
      name: 'associateName',
      label: 'Associate Name',
      type: FieldType.TEXT,
      description: 'Virtual identity of the associate (Soft RLS)',
      icon: 'IconUser',
    },
    {
      universalIdentifier: '12b90fc3-ebff-4269-a4f1-ec1d1634aad7',
      name: 'name',
      type: FieldType.TEXT,
      label: 'Lead Name',
    },
    {
      universalIdentifier: 'ee73f5f3-3aa8-4a21-a8c6-1796e7eb1d43',
      name: 'company',
      type: FieldType.RELATION,
      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: '1996379b-049c-48e6-a52c-d499e2340381',
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'companyId',
      },
      label: 'Company / Organization',
    },
    {
      universalIdentifier: 'b21064a2-b73d-4680-8525-0a19f04ec0e4',
      name: 'email',
      type: FieldType.EMAILS,
      label: 'Email',
    },
    {
      universalIdentifier: 'ddc9818e-4ad2-46af-9536-fcbb5a37f8a4',
      name: 'phone',
      type: FieldType.PHONES,
      label: 'Phone Number',
    },
    {
      universalIdentifier: '620d71c8-ff98-465e-a2d6-234531ba3858',
      name: 'source',
      type: FieldType.SELECT,
      label: 'Lead Source',
      options: [
        { label: 'Website (WordPress)', value: 'WEBSITE', position: 0, color: 'blue' },
        { label: 'Call', value: 'CALL', position: 1, color: 'green' },
        { label: 'Direct', value: 'DIRECT', position: 2, color: 'gray' },
        { label: 'SalesHub', value: 'SALESHUB', position: 3, color: 'purple' },
      ],
    },
    {
      universalIdentifier: '0739daf4-5a5d-4fed-9132-fef2eb371192',
      name: 'status',
      type: FieldType.SELECT,
      label: 'Status',
      options: [
        { label: 'New', value: 'NEW', position: 0, color: 'sky' },
        { label: 'Contacted', value: 'CONTACTED', position: 1, color: 'yellow' },
        { label: 'Qualified', value: 'QUALIFIED', position: 2, color: 'green' },
        { label: 'Disqualified', value: 'DISQUALIFIED', position: 3, color: 'red' },
      ],
    },
    {
      universalIdentifier: '78b9a10c-eb4b-4a56-a19c-cb2d8a4f1a23',
      name: 'segment',
      type: FieldType.TEXT,
      label: 'Segment',
    },
    {
      universalIdentifier: '62a3d7b1-5f2c-49a0-9c1a-f3b7d5a9c2b4',
      name: 'leadType',
      type: FieldType.SELECT,
      label: 'Type',
      options: [
        { label: 'Pure EV', value: 'PURE_EV', position: 0, color: 'green' },
        { label: 'EV', value: 'EV', position: 1, color: 'blue' },
        { label: 'Electric (BOV)', value: 'ELECTRIC_BOV', position: 2, color: 'purple' },
      ],
    },
    {
      universalIdentifier: 'c9b3f7e1-8a2d-4b6c-a5d9-2f8a4c2b1b3d',
      name: 'city',
      type: FieldType.TEXT,
      label: 'City',
    },
    {
      universalIdentifier: '1a5d9c2b-4b8c-4f7e-9d6a-3c5b8a4f1e3d',
      name: 'material',
      type: FieldType.SELECT,
      label: 'Material',
      options: [
        { label: 'Heavy-truck swap packs', value: 'HEAVY_TRUCK_SWAP', position: 0, color: 'blue' },
        { label: 'Heavy-truck swap packs (N+1)', value: 'HEAVY_TRUCK_SWAP_N1', position: 1, color: 'sky' },
        { label: 'Multi-OEM EV packs', value: 'MULTI_OEM_EV', position: 2, color: 'green' },
        { label: '2W packs (LFP)', value: 'TWO_W_LFP', position: 3, color: 'yellow' },
        { label: 'Li-ion batteries', value: 'LI_ION_BATTERIES', position: 4, color: 'orange' },
      ],
    },
    {
      universalIdentifier: 'a8c4e6b2-7f2c-49a0-91c4-2f5c8d4b6e1a',
      name: 'priority',
      type: FieldType.SELECT,
      label: 'Priority',
      options: [
        { label: 'High', value: 'HIGH', position: 0, color: 'red' },
        { label: 'Medium', value: 'MEDIUM', position: 1, color: 'orange' },
        { label: 'Low', value: 'LOW', position: 2, color: 'green' },
      ],
    },
    {
      universalIdentifier: 'f4b8e2d6-1c2a-4d9f-a8c2-3d6c2b8f4a1e',
      name: 'estVolume',
      type: FieldType.TEXT,
      label: 'Estimated Volume',
    },
    {
      universalIdentifier: 'd584e26d-46a1-4181-b54d-cfae9849ac8d',
      name: 'assignedTo',
      type: FieldType.SELECT,
      label: 'Assigned Executive',
      options: [
        { label: 'Unassigned', value: 'UNASSIGNED', position: 0, color: 'gray' },
        { label: 'Manish', value: 'MANISH', position: 1, color: 'blue' },
        { label: 'Executive 1', value: 'EXECUTIVE_1', position: 2, color: 'green' },
        { label: 'Executive 2', value: 'EXECUTIVE_2', position: 3, color: 'purple' },
      ],
    },
    {
      universalIdentifier: 'ab3b68ff-a256-474f-a59d-c148ba58a602',
      name: 'notes',
      type: FieldType.TEXT,
      label: 'Internal Notes',
    },
    {
      universalIdentifier: '820464be-4131-482a-a9e9-d7b4db1b4432',
      name: 'convertedToOpportunityId',
      type: FieldType.TEXT,
      label: 'Converted To Opportunity ID',
    },
    {
      universalIdentifier: '368e7b51-512c-47bc-ad7f-d38a83ed1fbc',
      name: 'followUpStatus',
      type: FieldType.SELECT,
      label: 'Follow Up Status',
      options: [
        { label: 'None', value: 'NONE', position: 0, color: 'gray' },
        { label: 'Follow Up 1', value: 'FOLLOW_UP_1', position: 1, color: 'yellow' },
        { label: 'Follow Up 2', value: 'FOLLOW_UP_2', position: 2, color: 'orange' },
        { label: 'Follow Up 3', value: 'FOLLOW_UP_3', position: 3, color: 'red' },
      ],
    },
    {
      universalIdentifier: '9bdde85a-038b-4b2a-8884-6330ce1484f1',
      name: 'acknowledgmentSent',
      type: FieldType.BOOLEAN,
      label: 'Acknowledgment Sent',
    },
    {
      universalIdentifier: LEAD_DEPARTMENT_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'department',
      type: FieldType.SELECT,
      label: 'Department',
      options: [
        { label: 'Sales', value: 'SALES', position: 0, color: 'blue' },
        { label: 'BD', value: 'BD', position: 1, color: 'green' },
      ],
    },
    // Relation fields backing the HOD -> Manager -> Associate row-level
    // scoping (see src/roles/associate-role.ts, src/roles/manager-role.ts).
    // onDelete SET_NULL so removing a workspace member never deletes leads.
    {
      universalIdentifier: LEAD_ASSIGNED_ASSOCIATE_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'assignedAssociate',
      type: FieldType.RELATION,
      label: 'Assigned Associate',
      relationTargetObjectMetadataUniversalIdentifier: WORKSPACE_MEMBER.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: LEAD_ASSIGNED_ASSOCIATE_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'assignedAssociateId',
      },
    },
    {
      universalIdentifier: LEAD_ASSIGNED_MANAGER_PRIMARY_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'assignedManagerPrimary',
      type: FieldType.RELATION,
      label: 'Assigned Manager',
      relationTargetObjectMetadataUniversalIdentifier: WORKSPACE_MEMBER.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: LEAD_ASSIGNED_MANAGER_PRIMARY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'assignedManagerPrimaryId',
      },
    },
    {
      // Only set when the Associate reports to a second Manager at the same
      // time (e.g. Aditya, who reports to both Manish Chauhan and Hanuman).
      universalIdentifier: LEAD_ASSIGNED_MANAGER_SECONDARY_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'assignedManagerSecondary',
      type: FieldType.RELATION,
      label: 'Assigned Manager (secondary)',
      relationTargetObjectMetadataUniversalIdentifier: WORKSPACE_MEMBER.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: LEAD_ASSIGNED_MANAGER_SECONDARY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'assignedManagerSecondaryId',
      },
    },
  ],
});

