import requests

API_KEY = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg'

# Get first lead
res = requests.get('https://minimines.twenty.com/rest/leads?limit=1', headers={'Authorization': API_KEY})
lead_id = res.json()['data']['leads']['edges'][0]['node']['id']

# Try PATCH with workedBy
patch1 = requests.patch(f'https://minimines.twenty.com/rest/leads/{lead_id}', headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}, json={'workedBy': 'PRASHANTH'})
print("workedBy:", patch1.status_code, patch1.text[:200])

# Try PATCH with workedby
patch2 = requests.patch(f'https://minimines.twenty.com/rest/leads/{lead_id}', headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}, json={'workedby': 'PRASHANTH'})
print("workedby:", patch2.status_code, patch2.text[:200])
