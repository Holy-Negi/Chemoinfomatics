import pubchempy as pcp
aa = pcp.get_compounds('alanine', 'name')
for i in aa:
    print('CID: {}\tName: {}'.format(i.cid, i.iupac_name))
    
l_ala_3d = pcp.get_compounds(5950, 'cid', record_type='3d')
l_ala_3d = l_ala_3d[0]
print(l_ala_3d.mmff94_energy_3d, l_ala_3d.volume_3d)
print(l_ala_3d)
# (1.5212, 68.8)

properties = ['IUPACName', 'MolecularFormula', 'MolecularWeight', 'XLogP', 'TPSA', 'CanonicalSMILES']
a = pcp.get_properties(properties, 'alanine', 'name')
print(a)