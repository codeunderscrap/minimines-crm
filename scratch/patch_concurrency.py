import re

path = r'D:\MINIMINES\MINIMINESBDCRM\minimines-crm\node_modules\twenty-sdk\dist\login-BzHQgxeV.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The file uploader snippet in the new sdk is:
# T=Array.from(p.builtFileInfos.values()).map(async e=>{s&&i?.(`Uploading ${e.builtPath}`);let t=await C.uploadFile({builtPath:e.builtPath,fileFolder:e.fileFolder});t.success||w.push(`Failed to upload ${e.builtPath}: ${Tw(t.error)}`)});if(await Promise.all(T),w.length>0)return

old_str = "T=Array.from(p.builtFileInfos.values()).map(async e=>{s&&i?.(`Uploading ${e.builtPath}`);let t=await C.uploadFile({builtPath:e.builtPath,fileFolder:e.fileFolder});t.success||w.push(`Failed to upload ${e.builtPath}: ${Tw(t.error)}`)});if(await Promise.all(T),w.length>0)return"
new_str = "T=[];for(let e of Array.from(p.builtFileInfos.values())){s&&i?.(`Uploading ${e.builtPath}`);let t=await C.uploadFile({builtPath:e.builtPath,fileFolder:e.fileFolder});t.success||w.push(`Failed to upload ${e.builtPath}: ${Tw(t.error)}`);await new Promise(r=>setTimeout(r,500));}if(w.length>0)return"

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched file concurrency successfully!")
else:
    print("Could not find the concurrency target string!")
