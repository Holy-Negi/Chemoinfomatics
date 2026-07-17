import { useState } from "react";
import { TextField, Button } from "@mui/material";
import ComponentRowsEditor from "./ComponentRowsEditor.jsx";

function ReactionForm({ onCreated }) {
  const [expCode, setExpCode] = useState("");
  const [date, setDate] = useState("");
  const [scale, setScale] = useState("");
  const [conc, setConc] = useState("");
  const [note, setNote] = useState("");
  const [components, setComponents] = useState([{ name: "", smiles: "", role: "reactant", equiv: "", density: "", yield: "" }]);

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:8000/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exp_code: expCode,
          date: new Date(date).toISOString(),   // yyyy-mm-dd → ISO日時
          scale: Number(scale),                 // 文字列→数値
          conc: Number(conc),
          note: note || null,
          components: components.map((c) => ({
            name: c.name,
            smiles: c.smiles,
            role: c.role,
            equiv: c.equiv === "" ? null : Number(c.equiv),
            density: c.density === "" ? null : Number(c.density),
            yield_percent: c.yield === "" ? null : Number(c.yield)
          })),
        }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(JSON.stringify(err.detail)); }
      // フォームを初期化
      setExpCode(""); setDate(""); setScale(""); setConc(""); setNote("");
      setComponents([{ name: "", smiles: "", role: "reactant", equiv: "", density: "", yield: "" }]);
      onCreated();
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 16 }}>
      <h3>New reaction</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <TextField label="Exp code" size="small" value={expCode} onChange={(e) => setExpCode(e.target.value)} />
        <TextField type="date" size="small" value={date} onChange={(e) => setDate(e.target.value)} />
        <TextField label="Scale (mmol)" size="small" value={scale} onChange={(e) => setScale(e.target.value)} />
        <TextField label="Conc (mol/L)" size="small" value={conc} onChange={(e) => setConc(e.target.value)} />
        <TextField label="Note" size="small" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <ComponentRowsEditor components={components} setComponents={setComponents} />
      <Button variant="contained" onClick={handleCreate} style={{ marginTop: 8 }}>Register</Button>
    </div>
  );
}
export default ReactionForm;