export const metadata = { title: "マイニュース" };

const css = `
body{margin:0;font-family:"Hiragino Sans",sans-serif;line-height:1.7;background:#eef2f5;color:#14212b}
main{max-width:680px;margin:0 auto;padding:24px 16px 56px}
input{font:inherit;font-size:16px;padding:10px 12px;border:1px solid #d3dce3;border-radius:8px;width:100%;box-sizing:border-box}
article{background:#fff;border:1px solid #d3dce3;border-radius:10px;padding:14px 16px;margin-bottom:12px}
article h2{font-size:1.05rem;margin:0 0 4px}
article a{color:inherit;text-decoration:none}
.meta{color:#5a6b78;font-size:.82rem;margin:0 0 4px}
.err{color:#b3361f;font-size:.85rem}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{css}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

