import CompoundTable from "./CompoundTable.jsx";
import ReactionTable from "./ReactionTable.jsx";
import StoichiometricTable from "./StoichiometricTable.jsx";

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Compounds</h2>
      <CompoundTable />
      <h2>Reactions</h2>
      <ReactionTable />
      <StoichiometricTable />
    </div>
  );
}
export default App;