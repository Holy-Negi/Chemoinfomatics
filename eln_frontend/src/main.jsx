import { BrowserRouter } from "react-router-dom"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import App from './App.jsx'

const theme = createTheme({palette: { mode: "dark" } })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);

/*
全体の流れ
index.html に <div id="root"></div>（空の入れ物）がある
        │
main.jsx が実行される
        │
① App.jsx から App コンポーネントを import
② createRoot で id="root" の要素を描画先に設定
③ .render(<App />) で App を root に描画
        │
        ▼
ブラウザに化合物テーブルが表示される
*/