import df from 'markdown-it';
const { MarkdownIt } = df;
const md = new MarkdownIt();
export default async function handler(req, res) {
  const { mdData } = req.body;
  const html = md.render(mdData);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.json({
    status: "success",
    data: {
        html: html
    }
});
}