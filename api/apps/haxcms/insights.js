import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { courseStatsFromOutline, siteHTMLContent, resolveSiteData } from "./lib/JOSHelpers.js";
import rs from "text-readability";
// given a site, and current page, obtain stats that are possibly relevant
// to smart blocks like lesson-intro, course-intro and others as long
// as they might be relevant to pedagogy. This is pretty open ended
// but things like # of videos, text length, etc
export default async function handler(req, res) {
  let data = {
    page : {},
    branch : {},
    site : {}
  };
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.site) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  if (body.site && body.type) {
    // get URL bits for validating and forming calls
    let url = '';
    if (body.type === 'link') {
      url = body.site.replace('/site.json', '');
    }
    else {
      body.site.file = body.site.file.replace('iam.', 'oer.');
      // abuse that we have this prop for where somerthing lives
      url = body.site.file.replace('/site.json', '');
    }
    // handle trailing slash
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    var parseURL = new URL(url);
    // verify we have a path / host
    if (parseURL.pathname && parseURL.host) {
      // support for iam vs oer
      if (parseURL.host) {
        // specific to our instances but iam is going to block access when querying for the site content
        // iam is the authoring domain while oer is the openly available one which if printing
        // and rendering the content appropriately, this is the way to do it
        parseURL.host = parseURL.host.replace('iam.', 'oer.');
      }
      const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
      var siteData = body.site || null;
      let itemId = body.activeId || null;
      let ancestor = body.ancestorId || null;
      if (ancestor === "null") {
        ancestor = null;
      }
      if (body.type === 'link') {
        siteData = null;
      }
      data.page = await courseStatsFromOutline(base, siteData, itemId);
      if (ancestor == null) {
        data.branch = data.page;
      }
      else {
        data.branch = await courseStatsFromOutline(base, siteData, ancestor);
      }
      data.site = await courseStatsFromOutline(base, siteData, null);
      // calculate readability
      let text = await siteHTMLContent(base, siteData, itemId, true, true);
      data.page.readability = {
        gradeLevel: rs.textStandard(text, true), // grade level from multiple tests averaged
        difficultWords: rs.difficultWords(text), // difficult words
        syllableCount: rs.syllableCount(text), // sylables
        lexiconCount: rs.lexiconCount(text), // word count
        sentenceCount: rs.sentenceCount(text), // sentences
      };
      if (ancestor == null) {
        data.branch.readability = data.page.readability;
      }
      else {
        text = await siteHTMLContent(base, siteData, ancestor, true, true);
        data.branch.readability = {
          gradeLevel: rs.textStandard(text, true), // grade level from multiple tests averaged
          difficultWords: rs.difficultWords(text), // difficult words
          syllableCount: rs.syllableCount(text), // sylables
          lexiconCount: rs.lexiconCount(text), // word count
          sentenceCount: rs.sentenceCount(text), // sentences
        };
      }
      text = await siteHTMLContent(base, siteData, null, true, true);
      data.site.readability = {
        gradeLevel: rs.textStandard(text, true), // grade level from multiple tests averaged
        difficultWords: rs.difficultWords(text), // difficult words
        syllableCount: rs.syllableCount(text), // sylables
        lexiconCount: rs.lexiconCount(text), // word count
        sentenceCount: rs.sentenceCount(text), // sentences
      };

      // get updated data stats
      const fullManifest = await resolveSiteData(base, siteData);
      data.site.updated = fullManifest.metadata.site.updated;
      data.site.created = fullManifest.metadata.site.updated;

      const activeBranch = fullManifest.getItemById(ancestor);
      data.branch.updated = activeBranch.metadata.updated;
      data.branch.created = activeBranch.metadata.created;
      
      const activePage = fullManifest.getItemById(itemId);
      data.page.updated = activePage.metadata.updated;
      data.page.created = activePage.metadata.created;
      
      // obtain the last 5 updated items
      const updateOrder = fullManifest.orderTree(fullManifest.items, 'updated');
      data.site.updatedItems = updateOrder.slice(0,5);
    }
  }
  res = stdResponse(res, data);
}