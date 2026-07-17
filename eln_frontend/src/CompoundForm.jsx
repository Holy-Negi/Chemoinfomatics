import { useState } from "react";
import {
  TextField,
  Button
} from '@mui/material';

function CompoundForm({ onCreated }) {
  const [name, setName] = useState("");
  const [smiles, setSmiles] = useState("");
  const [density, setDensity] = useState("");

  const handleCreate = async () => {
    try {
      const payload = {
        name,
        smiles,
        density: density === "" ? null : Number(density)
      };
      const res = await fetch("http://localhost:8000/compounds", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
      }
      setName("");
      setSmiles("");
      setDensity("");
      onCreated();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleResolve = async () => {
    try {
      const res = await fetch(`http://localhost:8000/resolve?name=${encodeURIComponent(name)}`)
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail)
      };
      const data = await res.json();
      const smiles = data.smiles
      setSmiles(smiles);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 16 }}>
      <h3>New compound</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={handleResolve}>Resolve</Button>
        <TextField label="SMILES" value={smiles} onChange={(e) => setSmiles(e.target.value)} />
        <TextField label="density" value={density} onChange={(e) => setDensity(e.target.value)} />
      </div>
      <Button variant="contained" onClick={handleCreate}>Register</Button>
    </div>
  )
}

export default CompoundForm;