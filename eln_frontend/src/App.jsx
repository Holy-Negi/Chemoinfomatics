import CompoundTable from "./CompoundTable.jsx"
import ReactionTable from "./ReactionTable.jsx"
// import BaseAccordion from "./Test.jsx"

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Compounds</h2>
      <CompoundTable />
      <h2>Reactions</h2>
      <ReactionTable />
      <h2>Test</h2> 
      {/* <BaseAccordion /> */}
    </div>
  );
}

export default App;