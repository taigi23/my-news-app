import Parser from "rss-parser";

// 取得元。ここに足せばニュースが増えます
const FEEDS = [
  { name: "NHKニュース", url: "https://www.nhk.or.jp/rss/news/cat0.xml" },
  { name: "ITmedia NEWS", url: "https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml" },
  { name: "Yahoo!ニュース", url: "https://news.yahoo.co.jp/rss/topics/top-picks.xml" },
];

export const dynamic = "force-dynamic";
const parser = new Parser({ timeout: 8000 });
let cache = { at: 0, data: null };

async function loadFeed(feed) {
  const res = await parser.parseURL(feed.url);
  return (res.items || []).map((it) => ({
    source: feed.name,
    title: (it.title || "").trim(),
    summary: (it.contentSnippet || "").replace(/\s+/g, " ").trim().slice(0, 200),
    link: it.link || "",
    date: it.isoDate || it.pubDate || null,
  }));
}

export async function GET() {
  if (cache.data && Date.now() - cache.at < 10 * 60 * 1000) {
    return Response.json(cache.data);
  }
  const results = await Promise.allSettled(FEEDS.map(loadFeed));
  const items = [];
  const errors = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") items.push(...r.value);
    else errors.push({ source: FEEDS[i].name });
  });
  const seen = new Set();
  const unique = items.filter((x) => x.link && !seen.has(x.link) && seen.add(x.link));
  unique.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const data = { items: unique, errors };
  if (unique.length) cache = { at: Date.now(), data };
  return Response.json(data);
}

