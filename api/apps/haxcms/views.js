import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import { resolveSiteData } from "./lib/JOSHelpers.js";
import { parse } from 'node-html-parser';

// vercel to slice our data into views that we can remix at will
export default async function handler(req, res) {
  let siteManifest = {};
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
      siteManifest = await resolveSiteData(base, siteData);
      siteManifest.items = siteManifest.orderTree(siteManifest.items);
      // filter by criteria matching one at a time as this is a intersection, not union query
      if (body.tags) {
        siteManifest.items = siteManifest.items.filter((item) => {
          if (item.metadata && item.metadata.tags && item.metadata.tags.includes(body.tags)) {
            return true;
          }
          return false;
        });
      }
      if (body.parent) {
        siteManifest.items = siteManifest.items.filter((item) => {
          if (item.parent === body.parent) {
            return true;
          }
          return false;
        });
      }
      if (body.title) {
        siteManifest.items = siteManifest.items.filter((item) => {
          if (item.title.toLowerCase().indexOf(body.title.toLowerCase()) >= 0) {
            return true;
          }
          return false;
        });
      }
      // special support for media as we now need to take the items and load the content
      if (body.displayOf === "blocks" || body.displayOf === "full") {
        for (var i in siteManifest.items) {
          let content = await siteManifest.getContentById(siteManifest.items[i].id, true);
          if (body.displayOf === "full") {
            // full content, way easier than deep media parsing
            // @note this can be a massive response back to the DOM to render if we have a big site
            // comment back in if we find a need for this capability
            siteManifest.items[i].contents = content;
          }
          else {
            // building a media response
            siteManifest.items[i].media = {};
            let doc = parse(`<div id="wrapper">${content}</div>`);  
            var data = {};
            // run through each type of query and get the HTML references
            let dataInclude = ['audio', 'selfChecks', 'objectives', 'authorNotes', 'images', 'h5p', 'headings', 'dataTables','specialTags', 'links', 'placeholders','readTime','video'];
            if (body.blockFilter && dataInclude.includes(body.blockFilter)) {
              dataInclude = [body.blockFilter];
            }
            for (let inc of dataInclude) {
              switch (inc) {
                case 'audio':
                  data[inc] = doc.querySelectorAll('audio,audio-player');
                break;
                case 'video':
                  data[inc] = doc.querySelectorAll('video-player,iframe[src*="youtube.com"],iframe[src*="youtube-nocookie.com"],iframe[src*="vimeo.com"],video[src],video source[src],a11y-media-player');
                break;
                case 'selfChecks':
                  data[inc] = doc.querySelectorAll('iframe.entity_iframe:not(.elmsmedia_h5p_content),self-check,multiple-choice');
                break;
                case 'h5p':
                  data[inc] = doc.querySelectorAll('iframe.elmsmedia_h5p_content,iframe[src*="h5p/embed"]');
                break;
                case 'objectives':
                  data[inc] = doc.querySelectorAll('instruction-card[type="objectives"] li');
                break;
                case 'authorNotes':
                  data[inc] = doc.querySelectorAll('page-flag');
                break;
                case 'images':
                  data[inc] = doc.querySelectorAll('media-image,img,simple-img');
                break;
                case 'headings':
                  data[inc] = doc.querySelectorAll('h1,h2,h3,h4,h5,h6,relative-heading');
                break;
                case 'dataTables':
                  data[inc] = doc.querySelectorAll('table');
                break;
                case 'specialTags':
                  data[inc] = doc.querySelectorAll('*:not(p,div,h1,h2,h3,h4,h5,h6,table,bold,li,ul,ol,span,a,em,b,i,strike,u,code,pre,img,hr,tr,td,th)').length;
                break;
                case 'links':
                  data[inc] = doc.querySelectorAll('a[href^="http://"],a[href^="https://"]');
                break;
                case 'placeholders':
                  data[inc] = doc.querySelectorAll('place-holder');
                break;
                // variant on links, not included by default as it does more dom parsing then needed by overview stats
                case 'linkData':
                  var extLinks = doc.querySelectorAll('a[href^="http://"],a[href^="https://"]');
                  data.linkData = {};
                  for (let el of extLinks) {
                    // obtain which page this link shows up on
                    let parent = el.parentNode;
                    while (parent && !parent.getAttribute('data-jos-item-id')) {
                      parent = parent.parentNode;      
                    }
                    let tmpItem = {
                      linkTitle: el.innerText,
                      itemId: parent.getAttribute('data-jos-item-id'),
                    };
                    if (data.linkData[el.getAttribute('href')]) {
                      data.linkData[el.getAttribute('href')].push(tmpItem);
                    }
                    else {
                      data.linkData[el.getAttribute('href')] = [tmpItem];
                    }
                  }
                break;
                
              }
            }
            // run through anythign where we found data and build the HTML of JUST that type
            for (var j in data) {
              siteManifest.items[i].media[j] = '';
              for (var k in data[j]) {
                siteManifest.items[i].media[j] += data[j][k].outerHTML + "\n";
              }
            }
          }
        }
      }
      // now we have everything, let's mess with it
    }
    let options = {};
    // 15 minute cache default
    if (!body.cacheBuster) {
      options.cache = 300;
    }
    res = stdResponse(res, siteManifest.items || [], options);
  }
  else {
    res = invalidRequest(res, 'site location required');
  }
}