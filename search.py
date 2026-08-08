import json
import re

path = r'C:\Users\store\.gemini\antigravity\brain\cf7e9d37-0cf7-4719-bdce-c7b34befabb5\.system_generated\logs\transcript_full.jsonl'

matches = []
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'content' in data:
                content = data['content']
                if re.search(r'(?i)(inbound leads|communication tabs|redesign)', content):
                    if data['type'] in ['USER_INPUT', 'PLANNER_RESPONSE']:
                        val = content[:3000].replace('\n', ' ')
                        matches.append(data['type'] + ': ' + val)
        except Exception as e:
            pass

with open('search_output.txt', 'w', encoding='utf-8') as f:
    for match in matches[-30:]:
        f.write(match + '\n' + '-'*80 + '\n')
