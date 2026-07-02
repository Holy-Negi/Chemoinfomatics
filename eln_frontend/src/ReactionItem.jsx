import { useState } from "react";
import { Collapse, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function ReactionItem({ reaction, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", flex: 1 }}>
          <h3 style={{ margin: 0 }}>{open ? "▼" : "▶"} {reaction.exp_code}</h3>
        </div>
        <Button onClick={() => onEdit(reaction)}>Edit</Button>
        <Button color="error" onClick={() => onDelete(reaction.id)}>Delete</Button>
      </div>

      <Collapse in={open}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell><TableCell>Role</TableCell><TableCell>Equiv</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reaction.components.map((comp) => (
              <TableRow key={comp.id}>
                <TableCell>{comp.compound.name}</TableCell>
                <TableCell>{comp.role}</TableCell>
                <TableCell>{comp.equiv ?? "-"} eq</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </div>
  );
}
export default ReactionItem;