import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "../lib/JSONOutlineSchema.js";
import { JSONOutlineSchemaItem } from "../lib/JSONOutlineSchemaItem.js";
import fetch from "node-fetch";
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();

const site = new JSONOutlineSchema();

export default async function handler(req, res) {
  let body = {};
  if (req.query) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  if (!body || !body.md) {
    res = invalidRequest(res, 'missing `md` param');
  }
  else {
    // pull head matter out of the notion MD files
    const reg1 = new RegExp(/#\s(.*?)\n\n?(.*?):\s(.*)\n(.*?):\s((.|\n)*?)\n\n/, 'igm');
    // pull title out of the head matter
    const reg2 = new RegExp(/(#\s)(.*?)\n/);
    // pull data out of the head matter into properties
    const reg3 = new RegExp(/(.*?)(:\s)(.*)/, 'igm');

    let url = body.md.trim();
    let pieces = url.replace("https://github.com/","").split('/');
    let basePath = `https://api.github.com/repos/${pieces[0]}/${pieces[1]}`;
    var branch = await fetch(`${basePath}`).then((d) => d.ok ? d.json(): {}).then(d => d.default_branch);
    var downloads = {};
    var filepathBase = '';
    var githubData = await fetch(`${basePath}/git/trees/${branch}?recursive=1`).then((d) => d.ok ? d.json(): {}).then(d => d.tree);
    for await (const ghFile of githubData) {
      // should be 1st file in the tree
      if (ghFile.path.indexOf('.csv') !== -1) {
        filepathBase = ghFile.path.replace('.csv','');
      }
      else if (ghFile.path.indexOf('.md') === -1) {
        // it's a file that we need to account for later on when we download the files
        // ignore folders
        if (ghFile.path.indexOf('.') !== -1) {
          downloads[ghFile.path.replace(`${filepathBase}/`,'')] = `https://raw.githubusercontent.com/${pieces[0]}/${pieces[1]}/${branch}/${ghFile.path}`;
        }
      }
      else {
        var md = await fetch(`https://raw.githubusercontent.com/${pieces[0]}/${pieces[1]}/${branch}/${ghFile.path}`).then((d) => d.ok ? d.text(): '');
        let data = {
          title: null,
          content: null,
          values: {},
        };
        
        // pull head matter out into variables
        // need a regex for notion
        let headMatter = md.match(reg1)[0];
        data.title = headMatter.match(reg2)[2];
        headMatter.match(reg3).map((line) => {
          let parts = line.split(':');
          data.values[parts[0].trim().toLowerCase()] = parts[1].trim();
        });
        data.content = await mdClass.render(md.replace(headMatter,''));
        let item = new JSONOutlineSchemaItem();
        item.title = data.title;
        item.contents = data.content;
        item.slug = ghFile.path.replace(`${filepathBase}/`,'').replace('.md','');
        // path clean up a bit in file name even
        item.location = `content/${ghFile.path.replace(`${filepathBase}/`,'').replace('.md','')}.html`;
        // order is like 10.1
        item.order = parseInt(data.values.id.split('.').pop());
        // only 1 depth
        item.indent = 1;
        // @todo calculate parent
        item.parent = null;
        site.addItem(item);
      }
    }

    // pull title into name of the page
    // pull data out into the fields of the page
    // create 1 JOS item from this info and converting the content

    // after that
    // figure out how to import multiple by scanning just the entry point file
    // need to hunt for titles after a git clone if possible
    // look for entry folder and take all names and split off the file from the UUID
    // use the UUID to inform the JOS item
    // loop through

    // then handle the files which we can repurpose for other importers
    // put all files to download into another field that HAXcms will then have to understand how to handle
    // rewrite the paths to those files
    let headers = {
      cache: 180
    };    
    stdResponse(res, { items: site.items, downloads: downloads }, headers);
  }
}