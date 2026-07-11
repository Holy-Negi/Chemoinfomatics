import { Routes, Route, Link, Navigate } from "react-router-dom";
import CompoundTable from "./CompoundTable.jsx";
import ReactionTable from "./ReactionTable.jsx";
import StoichiometricTable from "./StoichiometricTable.jsx";

function App() {
  return (
    <div style={{ padding: 24 }}>
      <nav style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <Link to="/compounds">Compounds</Link>
        <Link to="/reactions">Reactions</Link>
        <Link to="/stoichiometry">Stoichiometry</Link>
      </nav>

      <Routes>
        <Route path="/compounds" element={<CompoundTable />} />
        <Route path="/reactions" element={<ReactionTable />} />
        <Route path="/stoichiometry" element={<StoichiometricTable />} />
        <Route path="/" element={<Navigate to="/compounds" />} />
      </Routes>
    </div>
  );
}
export default App;