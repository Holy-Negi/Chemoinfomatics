from rdkit import Chem
from rdkit.Chem import Descriptors

# RDKitでSMILESからINCHIKeyやMolWtなどの物性情報を取得

def compute_properties(smiles: str) -> dict | None: # ->: 戻り値の型アノテーション
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    return {
        "smiles": Chem.MolToSmiles(mol),
        "inchikey": Chem.MolToInchiKey(mol),
        "mw": Descriptors.MolWt(mol),
        "exact_mass": Descriptors.ExactMolWt(mol),
        "logp": Descriptors.MolLogP(mol)
    }