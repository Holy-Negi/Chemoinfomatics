import { useState } from "react";
import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

function ReactionItem({ reaction }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>{reaction.exp_code}</h3>
      </div>

      <Collapse in={open}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Equivalent</TableCell>
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