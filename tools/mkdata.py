import json, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
m = json.load(open(R + '/data/mols.json')); p = json.load(open(R + '/data/pdb.json'))
open(R + '/bio/00_data_mol.js', 'w', encoding='utf8').write('/* малые молекулы: координаты построены по формулам (SMILES) */\nconst BIO_MOL = ' + json.dumps(m, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(R + '/bio/00_data_pdb.js', 'w', encoding='utf8').write('/* белки, ДНК и мембраны: атомные структуры из Protein Data Bank */\nconst BIO_PDB = ' + json.dumps(p, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(m), 'mols', os.path.getsize(R + '/bio/00_data_mol.js'), len(p), 'pdb', os.path.getsize(R + '/bio/00_data_pdb.js'))
