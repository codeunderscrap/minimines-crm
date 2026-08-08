import os
import re

for root, dirs, files in os.walk('src/fields'):
    for file in files:
        if file.endswith('.field.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove the const ... line
            content = re.sub(r"const [0-9a-fA-F\-]+_CONST = '[0-9a-fA-F\-]+';\n", '', content)
            
            # Replace the reference with the string literal
            content = re.sub(r"relationTargetObjectMetadataUniversalIdentifier:\s*([0-9a-fA-F\-]+)_CONST,", r"relationTargetObjectMetadataUniversalIdentifier: '\1',", content)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed {path}')
