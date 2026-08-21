import requests
import json

API_KEY = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg'

query = """
{
  __schema {
    types {
      name
      enumValues {
        name
      }
    }
  }
}
"""

res = requests.post('https://minimines.twenty.com/graphql', json={'query': query}, headers={'Authorization': API_KEY})
data = res.json()
types = data.get('data', {}).get('__schema', {}).get('types', [])
enums = [t for t in types if t.get('enumValues')]
for e in enums:
    if 'worked' in e['name'].lower() or 'lead' in e['name'].lower():
        print(e['name'], e['enumValues'])
