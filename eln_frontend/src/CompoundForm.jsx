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
    <>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="SMILES" value={smiles} onChange={(e) => setSmiles(e.target.value)} />
      <Button onClick={handleCreate}>Add</Button>
    </>
  )
}

export default CompoundForm;