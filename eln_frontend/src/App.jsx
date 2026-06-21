import { useState, useEffect } from "react";
/*  
  reactパッケージからuseStateライブラリとuseEffectライブラリをインポート
  コンポーネントに状態や副作用をもたせることのできるライブラリ
  取得した値を保持したり、コンポーネントの表示時に別の操作を行ったりすることができる
*/

function CompoundList() {
  const [compounds, setCompounds] = useState([]);  // 取得した一覧
  const [loading, setLoading] = useState(true); // 初期値は引数
// useState は [現在の値, 更新関数] という配列を返す
// ↑ これを1行で書いたのが [compounds, setCompounds] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/compounds")
    // fetch(URL): URLにHTTPリクエストを送る
      .then((res) => res.json())                     // JSONに変換
      .then((data) => { setCompounds(data); setLoading(false); });
      // .then(function): fetchのPromiseの結果が届いたら関数functionを実行する
  }, []);   
// useEffect(function, []) ← マウント（画面表示）時に関数functionを1回だけ実行する
// 2つ目の引数は依存配列といい、依存配列の中身が変わるごとにfunctionを実行する

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
// compounds.map(function): 関数functionを実行することで配列compoundsを書き換える
// Reactが配列を実際のHTMLに展開する

export default CompoundList;
// 他のファイルで使用できるように定義した関数CompoundListをエクスポートする
// defaultエクスポートは、1ファイルに1つだけ指定でき、インポートの際には好きな名前をつけられる