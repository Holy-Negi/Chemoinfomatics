import { useState, useEffect } from "react";
/*  
  reactパッケージからuseStateライブラリとuseEffectライブラリをインポート
  コンポーネントに状態や副作用をもたせることのできるライブラリ
  取得した値を保持したり、コンポーネントの表示時に別の操作を行ったりすることができる
*/
import {
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
  // useState は [現在の値, 更新関数] という配列を返す
  // ↑ これを1行で書いたのが [compounds, setCompounds] = useState([])
  
    useEffect(() => {
      const url = query
        ? `http://localhost:8000/compounds?q=${encodeURIComponent(query)}`
        : "http://localhost:8000/compounds";
      fetch(url)
      // fetch(URL): URLにHTTPリクエストを送る
        .then((res) => res.json())                     // JSONに変換
        .then((data) => { setCompounds(data); setLoading(false); });
        // .then(function): fetchのPromiseの結果が届いたら関数functionを実行する
    }, [query]);   
  // useEffect(function, []) ← マウント（画面表示）時に関数functionを1回だけ実行する
  // 2つ目の引数は依存配列といい、依存配列の中身が変わるごとにfunctionを実行する
  
  return (
    <>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {compounds.map((c) => ( // 配列を行に変換
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.mw?.toFixed(2)}</TableCell>
                  <TableCell>{c.logp?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
  // compounds.map(function): 関数functionを実行することで配列compoundsを書き換える
  // Reactが配列を実際のHTMLに展開する

export default CompoundTable;
// 他のファイルで使用できるように定義した関数CompoundTableをエクスポートする
// defaultエクスポートは、1ファイルに1つだけ指定でき、インポートの際には好きな名前をつけられる