import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { courseStatsFromOutline, siteHTMLContent, resolveSiteData } from "./lib/JOSHelpers.js";
import rs from "text-readability";

/**
 * as per https://www.npmjs.com/package/text-readability
 * 4.9 or lower	average 4th-grade student or lower
 * 5.0–5.9	average 5th or 6th-grade student
 * 6.0–6.9	average 7th or 8th-grade student
 * 7.0–7.9	average 9th or 10th-grade student
 * 8.0–8.9	average 11th or 12th-grade student
 * 9.0–9.9	average 13th to 15th-grade (college) student 
 */
function getGradeLevel(text) {
  const score = rs.daleChallReadabilityScore(text);
  if (score <= 4.9) {
    return "4th grade or lower";
  }
  else if (score > 4.9 && score <= 5.9) {
    return "5th / 6th grade";
  }
  else if (score > 5.9 && score <= 6.9) {
    return "7th / 8th grade";
  }
  else if (score > 6.9 && score <= 7.9) {
    return "9th / 10th grade";
  }
  else if (score > 7.9 && score <= 8.9) {
    return "11th / 12th grade";
  }
  else if (score > 8.9) {
    return "college level reading";
  }
}

// given a site, and current page, obtain stats that are possibly relevant
// to smart blocks like lesson-intro, course-intro and others as long
// as they might be relevant to pedagogy. This is pretty open ended
// but things like # of videos, text length, etc
export default async function handler(req, res) {
  var data = {};
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
      if (itemId === 'null') {
        itemId = null;
      }
      if (body.type === 'link') {
        siteData = null;
      }
      data = await courseStatsFromOutline(base, siteData, itemId);
      // calculate readability
      let text = await siteHTMLContent(base, siteData, itemId, true, true);
      data.readability = {
        gradeLevel: getGradeLevel(text), // grade level from multiple tests averaged
        difficultWords: rs.difficultWords(text), // difficult words
        syllableCount: rs.syllableCount(text), // sylables
        lexiconCount: rs.lexiconCount(text), // word count
        sentenceCount: rs.sentenceCount(text), // sentences
      };
      // specific to where this resides or stats about EVERYTHING
      const fullManifest = await resolveSiteData(base, siteData);
      var items = [...fullManifest.items];
      if (itemId === null || itemId == 'null') {
        data.updated = new Date(fullManifest.metadata.site.updated * 1000).toISOString();
        data.created = new Date(fullManifest.metadata.site.created * 1000).toISOString();
        data.title = fullManifest.title;
      }
      else {
        const activeItem = fullManifest.getItemById(itemId);
        data.updated = new Date(activeItem.metadata.updated * 1000).toISOString();
        data.created = new Date(activeItem.metadata.created * 1000).toISOString();
        // filters out all items to just those within the active branch of pages
        items = fullManifest.findBranch(itemId);   
        data.title = activeItem.title;
      }
      if (items && items.length > 0) {
        // order items by updated date
        // this is across ALL pages
        items.sort( function(a, b) {
          return parseInt(b.metadata.updated) - parseInt(a.metadata.updated);
        });
        // convert time stamp to ISO
        items.map((item) => {
          item.metadata.updated = new Date(item.metadata.updated * 1000).toISOString();
        });
        data.updatedItems = items.slice(0,6);
      }
    }
  }
  res = stdResponse(res, data);
}