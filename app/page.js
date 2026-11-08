"use client";
import { useEffect, useMemo, useState } from "react";

const KEY = "mynews.v2";
const words = (t) => t.split(/[、,\s]+/).filter(Boolean).map((w) => w.toLowerCase());

export default function Page() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [inc, setInc] = useState("");
  const [exc, setExc] = useState("");

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (s.inc) setInc(s.inc);
      if (s.exc) setExc(s.exc);
    } catch {}
    fetch("/api/news")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("ニュースを取得できませんでした。再読み込みしてください。"));
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ inc, exc })); } catch {}
  }, [inc, exc]);

  const shown = useMemo(() => {
    if (!data) return [];
    const I = words(inc), E = words(exc);
    return data.items.filter((a) => {
      const t = (a.title + a.summary).toLowerCase();
      if (E.some((w) => t.includes(w))) return false;
      return I.length === 0 || I.some((w) => t.includes(w));
    });
  }, [data, inc, exc]);

  return (
    <main>
      <h1>マイニュース</h1>
      <p>読みたい言葉</p>
      <input value={inc} onChange={(e) => setInc(e.target.value)} placeholder="例:AI、半導体" />
      <p>見たくない言葉</p>
      <input value={exc} onChange={(e) => setExc(e.target.value)} placeholder="例:芸能、噂" />

      {error && <p className="err">{error}</p>}
      {!data && !error && <p>読み込み中…</p>}
      {data?.errors?.map((e) => (
        <p className="err" key={e.source}>{e.source}の取得に失敗しました</p>
      ))}
      {data && <p><b>{data.items.length}件中 {shown.length}件を表示</b></p>}

      {shown.map((a) => (
        <article key={a.link}>
          <p className="meta">
            {a.source}{a.date ? "・" + new Date(a.date).toLocaleString("ja-JP") : ""}
          </p>
          <h2><a href={a.link} target="_blank" rel="noopener noreferrer">{a.title}</a></h2>
          {a.summary && <p>{a.summary}</p>}
        </article>
      ))}
    </main>
  );
}

