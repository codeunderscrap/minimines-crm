import re

path = r'D:\MINIMINES\MINIMINESBDCRM\minimines-crm\src\objects\opportunity.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """      label: 'Requirements Document (Optional)',
    },
    {
      universalIdentifier: 'f3918076-13a8-444a-a9a3-5f07df591d29',
      name: 'assignedManagerPrimary',
      type: FieldType.RELATION,
      relationTargetObjectMetadataUniversalIdentifier: 'c879f32f-4fc7-4ddf-ba59-3fb70e7a2b91',
      relationTargetFieldMetadataUniversalIdentifier: 'a40d5885-b986-4f4c-8854-3dfd2a58b5e9',
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'assignedManagerPrimaryId',
      },
      label: 'Assigned Manager',
    }
  ],
  indexMetadatas: []
};"""

target = """      label: 'Requirements Document (Optional)',
    }
  ],
  indexMetadatas: []
};"""

if target in content:
    content = content.replace(target, replacement)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched opportunity.ts successfully")
else:
    print("Could not find target string in opportunity.ts")
