import json
import re

path = r'C:\Users\store\.gemini\antigravity\brain\cf7e9d37-0cf7-4719-bdce-c7b34befabb5\.system_generated\logs\transcript_full.jsonl'

with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'content' in data:
                content = data['content']
                # Search for specific redesign proposal details
                if re.search(r'(?i)(inbound leads.*redesign|communications hub|conversion features)', content):
                    if data['type'] == 'PLANNER_RESPONSE':
                        if len(content) > 500:
                            with open('search_proposal.txt', 'a', encoding='utf-8') as outf:
                                outf.write(content + '\n' + '-'*80 + '\n')
        except Exception as e:
            pass
