import json, struct, sys
for f in sys.argv[1:]:
    d = open(f, 'rb').read()
    jl = struct.unpack('<I', d[12:16])[0]
    J = json.loads(d[20:20 + jl])
    imgs = J.get('images', [])
    imgb = sum(J['bufferViews'][i['bufferView']]['byteLength'] for i in imgs if 'bufferView' in i)
    total = len(d)
    print(f, 'total', total, 'json', jl, 'images', len(imgs), imgb, [i.get('mimeType') for i in imgs][:8], 'ext', J.get('extensionsUsed'), 'meshes', len(J.get('meshes', [])), 'acc', len(J['accessors']))
    from collections import Counter
    c = Counter(); 
    for a in J['accessors']: c[(a['componentType'], a['type'])] += a['count']
    print('  ', dict(c))
