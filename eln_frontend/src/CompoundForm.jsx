import { useState } from "react";
import {
  TextField,
  Button
} from '@mui/material';

function CompoundForm({ onCreated }) {
  const [name, setName] = useState("");
  const [smiles, setSmiles] = useState("");
  const [density, setDensity] = useState("");
  const [valid, setValid] = useState(null);

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
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="SMILES" value={smiles} onChange={(e) => { setSmiles(e.target.value); setValid(null); }} />
          <TextField label="density" value={density} onChange={(e) => setDensity(e.target.value)} />
          <Button onClick={handleResolve}>GET SMILES</Button>
          <Button variant="contained" onClick={handleCreate}>Register</Button>
        </div>
        <div style={{ width: 220, flexShrink: 0 }}>
          {smiles && (
            <img
              src={`http://localhost:8000/depict?smiles=${encodeURIComponent(smiles)}`}
              alt="structure"
              onLoad={() => setValid(true)}
              onError={() => setValid(false)}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
          {valid === null
            ? null
            : valid
              ? <p style={{ color: 'green' }}>✓ valid</p>
              : <p style={{ color: 'red' }}>✗ invalid</p>}
        </div>
      </div>
    </div>
  )
}

export default CompoundForm;