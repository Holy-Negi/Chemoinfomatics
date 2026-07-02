import { useState, useEffect } from "react";
import { Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const fmt = (v, d) => (v == null ? "-" : v.toFixed(d));   // null は "-"、数値は桁数指定

function EquivalentTable() {
  const [reactions, setReactions] = useState([]);
  const [reactionId, setReactionId] = useState("");
  const [scale, setScale] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/reactions").then((r) => r.json()).then(setReactions);
  }, []);

  const handleCompute = async () => {
    try {
      const url = `http://localhost:8000/reactions/${reactionId}/equivalents?scale=${encodeURIComponent(scale)}`;
      const res = await fetch(url);
      if (!res.ok) { const err = await res.json(); throw new Error(JSON.stringify(err.detail)); }
      setRows(await res.json());
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12 }}>
      <h2>当量表</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <Select size="small" value={reactionId} displayEmpty
          onChange={(e) => setReactionId(e.target.value)} style={{ minWidth: 160 }}>
          <MenuItem value="" disabled>Select reaction</MenuItem>
          {reactions.map((r) => <MenuItem key={r.id} value={r.id}>{r.exp_code}</MenuItem>)}
        </Select>
        <TextField label="Scale (mmol)" size="small" value={scale}
          onChange={(e) => setScale(e.target.value)} />
        <Button variant="contained" onClick={handleCompute}>Compute</Button>
      </div>

      {rows.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell><TableCell>Role</TableCell><TableCell>Equiv</TableCell>
              <TableCell>mmol</TableCell><TableCell>Mass (g)</TableCell><TableCell>Volume (mL)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{fmt(row.equiv, 2)}</TableCell>
                <TableCell>{fmt(row.mmol, 3)}</TableCell>
                <TableCell>{fmt(row.mass_g, 4)}</TableCell>
                <TableCell>{fmt(row.volume_ml, 3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
export default EquivalentTable;