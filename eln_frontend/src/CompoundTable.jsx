import { useState, useEffect, useCallback } from "react";
/*  
  reactパッケージからuseStateライブラリとuseEffectライブラリをインポート
  コンポーネントに状態や副作用をもたせることのできるライブラリ
  取得した値を保持したり、コンポーネントの表示時に別の操作を行ったりすることができる
*/
import CompoundEditDialog from "./CompoundEditDialog.jsx";
import CompoundForm from "./CompoundForm.jsx";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';

function CompoundTable() {
    const [compounds, setCompounds] = useState([]);  // 取得した一覧
    const [loading, setLoading] = useState(true); // 初期値は引数
    const [query, setQuery] = useState("");
    const [editing, setEditing] = useState(null);
    // useState は [現在の値, 更新関数] という配列を返す
    // ↑ これを1行で書いたのが [compounds, setCompounds] = useState([])
    const fetchCompounds = async () => {
      const url = query
        ? `http://localhost:8000/compounds?q=${encodeURIComponent(query)}`
        : "http://localhost:8000/compounds";
      const res = await fetch(url);
      const data = await res.json();
      setCompounds(data);
      setLoading(false);
    };
  
    useEffect(() => { fetchCompounds() }, [query]);
    // useEffect(function, []) ← マウント（画面表示）時に関数functionを1回だけ実行する
    // 2つ目の引数は依存配列といい、依存配列の中身（関数、つまりquery）が変わるごとにfunctionを実行する
    
    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete the data?")) {
        return; // ここで関数を抜ける
      }
      try {
        const res = await fetch(`http://localhost:8000/compounds/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail)
        };
        await fetchCompounds();
      } catch (e) {
        alert(e.message);
      }
    };

  return (
    <>
      <CompoundForm onCreated={fetchCompounds} />
      <TextField
        label="Search compounds" size="small" value={query}
        onChange={(e) => setQuery(e.target.value)} // 入力のたびにqueryを更新
      />
      {loading ? <p>Loading...</p> : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Molecular Weight</TableCell>
                <TableCell>LogP</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compounds.map((c) => ( // 配列を行に変換
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.mw?.toFixed(2)}</TableCell>
                  <TableCell>{c.logp?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button onClick={() => setEditing(c)}>Edit</Button>
                  </TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleDelete(c.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <CompoundEditDialog
        compound={editing}
        onClose={() => setEditing(null)}
        onUpdated={fetchCompounds}
      />
    </>
  );
}
  // compounds.map(function): 関数functionを実行することで配列compoundsを書き換える
  // Reactが配列を実際のHTMLに展開する

export default CompoundTable;
// 他のファイルで使用できるように定義した関数CompoundTableをエクスポートする
// defaultエクスポートは、1ファイルに1つだけ指定でき、インポートの際には好きな名前をつけられる