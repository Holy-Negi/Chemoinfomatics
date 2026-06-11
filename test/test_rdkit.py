import sys
sys.stdout.reconfigure(encoding='utf-8')
from rdkit import Chem
from rdkit.Chem import Draw
from rdkit.Chem import Descriptors

trp_smiles = "O=C(O)C(N)Cc1c[nH]c2ccccc12"
mol = Chem.MolFromSmiles(trp_smiles)
Draw.MolToFile(mol, 'tryptophan.png')

mw = Descriptors.MolWt(mol)
exact_mass = Descriptors.ExactMolWt(mol)
logp = Descriptors.MolLogP(mol)

print("=== 計算結果 ===")
print(f"分子量 (MW): {mw:.2f}")
print(f"精密質量 (Mass): {exact_mass:.4f}")
print(f"LogP (脂溶性): {logp:.2f}")