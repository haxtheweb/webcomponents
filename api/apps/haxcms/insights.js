import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { courseStatsFromOutline, siteHTMLContent, resolveSiteData } from "./lib/JOSHelpers.js";
import rs from "text-readability";
import { parse } from 'node-html-parser';
import fetch from "node-fetch";

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
      // get updated data stats
      const fullManifest = await resolveSiteData(base, siteData);
      if (ancestor == null) {
        data.branch.readability = data.page.readability;
      }
      else {
        text = await siteHTMLContent(base, siteData, ancestor, true, true);
        data.branch.readability = {
          gradeLevel: rs.textStandard(text, true), // grade level from multiple tests averaged
          difficultWords: rs.difficultWords(text), // difficult words
          syllableCount: rs.syllableCount(text), // syllable
          lexiconCount: rs.lexiconCount(text), // word count
          sentenceCount: rs.sentenceCount(text), // sentences
        };
        const activeBranch = fullManifest.getItemById(ancestor);
        data.branch.updated = new Date(activeBranch.metadata.updated * 1000).toISOString();
        data.branch.created = new Date(activeBranch.metadata.created * 1000).toISOString();   
      }
      text = await siteHTMLContent(base, siteData, null, true, true);
      data.site.readability = {
        gradeLevel: rs.textStandard(text, true), // grade level from multiple tests averaged
        difficultWords: rs.difficultWords(text), // difficult words
        syllableCount: rs.syllableCount(text), // sylables
        lexiconCount: rs.lexiconCount(text), // word count
        sentenceCount: rs.sentenceCount(text), // sentences
      };
      let responses = {};
      // @todo add UI option for toggling this
      if (body.validateLinks) {
        for (const link of Object.keys(data.site.externalLinkLocations)) {
          let resp;
          try {
            resp = await fetch(link, { method: "HEAD"});
            // rare but implies HEAD request not allowed
            if (resp.status === 405) {
              resp = await fetch(link, { method: "GET"});
            }
          }
          catch {
            resp = {
              ok: false,
              status: 999
            }
          }
          // we only care about dead links
          if (!resp.ok) {
            responses[link] = {
              ok: resp.ok,
              status: resp.status,
            }
          }
        }
        data.site.linkValidation = responses;
      }
      data.site.updated = new Date(fullManifest.metadata.site.updated * 1000).toISOString();
      data.site.created = new Date(fullManifest.metadata.site.created * 1000).toISOString();  
      const activePage = fullManifest.getItemById(itemId);
      data.page.updated = new Date(activePage.metadata.updated * 1000).toISOString();
      data.page.created = new Date(activePage.metadata.created * 1000).toISOString();
      // order items by updated date
      // this is across ALL pages
      fullManifest.items.sort( function(a, b) {
        return parseInt(b.metadata.updated) - parseInt(a.metadata.updated);
      });
      // convert time stamp to ISO
      fullManifest.items.map((item) => {
        item.metadata.updated = new Date(item.metadata.updated * 1000).toISOString();
      });
      data.site.updatedItems = fullManifest.items.slice(0,6);
    }
  }
  res = stdResponse(res, data);
}