import CompoundTable from "./CompoundTable.jsx";
import ReactionTable from "./ReactionTable.jsx";
import EquivalentTable from "./EquivalentTable.jsx";

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Compounds</h2>
      <CompoundTable />
      <h2>Reactions</h2>
      <ReactionTable />
      <EquivalentTable />
    </div>
  );
}
export default App;