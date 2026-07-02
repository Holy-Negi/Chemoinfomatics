import { TextField, Select, MenuItem, Button } from "@mui/material";

const ROLES = ["reactant", "reagent", "solvent", "catalyst", "product"];

function ComponentRowsEditor({ components, setComponents }) {
  // 末尾に空行を追加（スプレッドで新しい配列を作る）
  const addRow = () =>
    setComponents([...components, { smiles: "", role: "reactant", equiv: "" }]);

  // i番目の行の key フィールドだけ更新（map で新配列を作る）
  const updateRow = (i, key, value) =>
    setComponents(components.map((row, idx) =>
      idx === i ? { ...row, [key]: value } : row));

  // i番目の行を削除（filter で i 以外を残す）
  const removeRow = (i) =>
    setComponents(components.filter((_, idx) => idx !== i));

  return (
    <div>
      {components.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
          <TextField label="SMILES" size="small" value={row.smiles}
            onChange={(e) => updateRow(i, "smiles", e.target.value)} />
          <Select size="small" value={row.role}
            onChange={(e) => updateRow(i, "role", e.target.value)}>
            {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
          <TextField label="equiv" size="small" value={row.equiv} style={{ width: 90 }}
            onChange={(e) => updateRow(i, "equiv", e.target.value)} />
          <Button color="error" onClick={() => removeRow(i)}>×</Button>
        </div>
      ))}
      <Button onClick={addRow}>+ Add component</Button>
    </div>
  );
}
export default ComponentRowsEditor;