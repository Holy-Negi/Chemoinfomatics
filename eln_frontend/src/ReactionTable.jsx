import { useState, useEffect } from "react";
import ReactionItem from "./ReactionItem.jsx";

function ReactionTable() {
    const [reactions, setReactions] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch("http://localhost:8000/reactions")
        .then((res) => res.json())
        .then((data) => { setReactions(data); setLoading(false); });
    }, []);
  
    if (loading) return <p>Loading...</p>;
    return (
      <>
        {reactions.map((r) => <ReactionItem key={r.id} reaction={r} />)}
      </>
    );
  }

export default ReactionTable;