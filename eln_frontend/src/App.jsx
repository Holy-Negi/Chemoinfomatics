import { useState, useEffect } from "react";

function CompoundList() {
  const [compounds, setCompounds] = useState([]);  // 取得した一覧
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/compounds")        // APIを叩く
      .then((res) => res.json())                     // JSONをパース
      .then((data) => { setCompounds(data); setLoading(false); });
  }, []);   // ← 空配列＝「マウント時に1回だけ」実行

  if (loading) return <p>Loading...</p>;
  return (
    <table>
      <tbody>
        {compounds.map((c) => (                       // 配列を行に変換
          <tr key={c.id}>
            <td>{c.id}</td><td>{c.name}</td><td>{c.mw}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CompoundList;