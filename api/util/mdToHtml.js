import fetch from "node-fetch";
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();
export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  var md = body.md;
  var html;
  // md is actually a link reference so fetch it 1st
  if (req.body.type === 'link' && md) {
    md = await fetch(md.trim()).then((d) => d.ok ? d.text(): '');
  }
  html = await mdClass.render(md);
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=180');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.json({
    status: "success",
    data: html
  });
}