import fetch from "node-fetch";
import * as df from 'turndown';
const TurndownService = df.default;
var turndownService = new TurndownService();

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  var html = body.html;
  var markdown;
  // md is actually a link reference so fetch it 1st
  if (body.type === 'link' && html) {
    html = await fetch(html.trim()).then((d) => d.ok ? d.text(): '');
  }
  markdown = await turndownService.turndown(html);
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=180');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.json({
    status: "success",
    data: markdown
  });
}