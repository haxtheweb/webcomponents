import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "../lib/JSONOutlineSchema.js";
import { JSONOutlineSchemaItem } from "../lib/JSONOutlineSchemaItem.js";
import { cleanTitle } from "../lib/JOSHelpers.js";
import fetch from "node-fetch";
import { parse } from 'node-html-parser';
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();
const site = new JSONOutlineSchema();
export default async function handler(req, res) {
  let body = {};
  // must POST a md 
  body = stdPostBody(req);
  if (!body || !body.repoUrl) {
    res = invalidRequest(res, 'missing `repoUrl` param');
  }
  else {
    // pull head matter out of the notion MD files
    const reg1 = new RegExp(/#\s(.*?)\n\n?(.*?):\s(.*)\n(.*?):\s((.|\n)*?)\n\n/, 'igm');
    // pull title out of the head matter
    const reg2 = new RegExp(/(#\s)(.*?)\n/);
    // pull data out of the head matter into properties
    const reg3 = new RegExp(/(.*?)(:\s)(.*)/, 'igm');

    let url = body.repoUrl.trim();
    let pieces = url.replace("https://github.com/","").split('/');
    const owner = pieces[0];
    const repo = pieces[1];
    let basePath = `https://api.github.com/repos/${owner}/${repo}`;
    var branch = await fetch(`${basePath}`).then((d) => d.ok ? d.json(): {}).then(d => d.default_branch);
    var downloads = {};
    var fileMap = {};
    var lessons = {};
    var filepathBase = '';
    var githubData = await fetch(`${basePath}/git/trees/${branch}?recursive=1`).then((d) => d.ok ? d.json(): {}).then(d => d.tree);
    // establish file map and base path for all files PRIOR to getting contents
    for await (const ghFile of githubData) {
      // should be 1st file in the tree
      if (ghFile.path.indexOf('.csv') !== -1) {
        filepathBase = ghFile.path.replace('.csv','');
      }
      else if (ghFile.path.indexOf('.md') === -1) {
        // it's a file that we need to account for later on when we download the files
        // ignore folders
        if (ghFile.path.indexOf('.') !== -1) {
          downloads[encodeURI(ghFile.path.replace(`${filepathBase}/`,'files/')).replaceAll("%20","").replaceAll("%C","").replaceAll("%","")] = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURI(ghFile.path)}`;
          fileMap[encodeURI(ghFile.path.replace(`${filepathBase}/`,'files/')).replaceAll("%20","").replaceAll("%C","").replaceAll("%","")] = encodeURI(ghFile.path.replace(`${filepathBase}/`,''));
        }
      }
    }
    for await (const ghFile of githubData) {
      // should be 1st file in the tree
      if (ghFile.path.indexOf('.csv') !== -1) {
      }
      else if (ghFile.path.indexOf('.md') === -1) {
      }
      else {
        var md = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${ghFile.path}`).then((d) => d.ok ? d.text(): '');
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
        // test for lesson that we don't have yet
        if (data.values.lesson && !lessons[data.values.lesson]) {
          let lessonValue = data.values.lesson.split('. ');
          if (lessonValue.length === 1) { // no period
            lessonValue = [
              "0",
              lessonValue[0]
            ]
          }
          let lesson = new JSONOutlineSchemaItem();
          lesson.title = lessonValue[1];
          // blank page for now
          lesson.contents = '';
          lesson.slug = cleanTitle(lessonValue[1].toLowerCase());
          // path clean up a bit in file name even
          lesson.location = `content/${cleanTitle(lessonValue[1].toLowerCase())}.html`;
          // order is like 10.1
          lesson.order = parseInt(lessonValue[0]);
          // only 0 depth for lessons
          lesson.indent = 0;
          lesson.parent = null;
          lesson.metadata.pageType = 'lesson';
          site.addItem(lesson);
          lessons[data.values.lesson] = lesson;
        }
        // remove head matter from the md
        md = md.replace(headMatter,'');
        // replace all file references that we got matches on PRIOR to rendering to avoid encoding issues
        for await (const file of Object.keys(fileMap)) {
          md = md.replaceAll(fileMap[file], file);
        }
        data.content = await mdClass.render(md);
        let item = new JSONOutlineSchemaItem();
        item.title = data.title;
        item.contents = data.content;
        item.slug = cleanTitle(ghFile.path.replace(`${filepathBase}/`,'').replace('.md',''));
        // path clean up a bit in file name even
        item.location = `content/${cleanTitle(ghFile.path.replace(`${filepathBase}/`,'').replace('.md',''))}.html`;
        // order is like 10.1
        item.order = parseInt(data.values.id.split('.').pop());
        // only 1 depth
        item.indent = 1;
        // sanity check on lesson for a matching ID
        if (lessons[data.values.lesson]) {
          item.parent = lessons[data.values.lesson].id;
        }
        else {
          item.parent = null;
        }
        // @todo need to clean these up as far as what we allow for legit types after we get our ontology
        switch (data.values.type) {
          case '📙 Reading':
            item.metadata.pageType = 'reading';
          break;
          case '💬 Canvas Discussion':
            item.metadata.pageType = 'discuss';
          break;
          case '⚡️ Exercise':
            item.metadata.pageType = 'activity';
          break;
          case '🔎 Case Study':
            item.metadata.pageType = 'connection';
          break;
        }
        site.addItem(item);
      }
    }

    // then handle the files which we can repurpose for other importers
    // put all files to download into another field that HAXcms will then have to understand how to handle
    // rewrite the paths to those files

    stdResponse(res, {
      data: {
        items: site.items,
        filename: repo,
        files: downloads
      },
      status: 200
    }, {cache: 180, type: "application/json" });
  }
}