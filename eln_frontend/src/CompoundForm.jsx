import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

function CompoundForm({ onCreated }) {
  const [name, setName] = useState("");
  const [smiles, setSmiles] = useState("");

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:8000/compounds", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ name, smiles }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
      }
      setName("");
      setSmiles("");
      onCreated();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 16 }}>
      <h3 New compound></h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="SMILES" value={smiles} onChange={(e) => setSmiles(e.target.value)} />
      </div>
      <Button variant="contained" onClick={handleCreate}>Register</Button>
    </div>
  )
}

export default CompoundForm;