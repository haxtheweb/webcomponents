import { JSONOutlineSchema } from "./JSONOutlineSchema.js";
import { parse } from 'node-html-parser';
import fetch from "node-fetch";

// average adult reading pace
const WORDSPERMIN = 225;
// this either pulls the site from the location directly or from the data passed in
// so that other things can work with the outline as loaded
export async function resolveSiteData(siteLocation, siteData = null) {
  const site = new JSONOutlineSchema();
  // support side-loading site.json data through direct access
  // this is most useful for themes and solutions that are actively
  // running a HAXcms site and already have access to these details
  if (siteData) {
    site.file = siteData.file;
    site.id = siteData.id;
    site.title = siteData.title;
    site.author = siteData.author;
    site.description = siteData.description;
    site.license = siteData.license;
    site.metadata = siteData.metadata;
    site.items = siteData.items;
  }
  else {
    // test for some internal API implementation differences
    if (siteLocation.includes('.aanda.psu.edu') ||
    siteLocation.includes('.ed.science.psu.edu')) {
      // test for aanda elms as "basic auth" is required to bypass azure
      // and defer to app level permissions handling
      let buff = Buffer.from(process.env.ELMSLN_VERCEL_SERVICE_AUTH).toString('base64');
      site.__fetchOptions = {
        method: "GET",
        headers: {'Authorization': 'Basic ' + buff}
      };
      // need to store pathname for elms deploys bc of how paths were resolved
      let tmp = new URL(siteLocation);
      site.__siteLocationPathName = tmp.pathname;
      // location isn't at site.json bc this is generated path
      // so we need to lob this off from the path instead of site.json
      if (siteLocation.includes('/haxapi/loadJOS/')) {
        let urlData = new URL(siteLocation);``
        site.__siteFileBase = urlData.pathname;
      }
    }
    await site.load(`${siteLocation}/site.json`, site.__fetchOptions);
  }
  return site;
}

// generate stats given a location within the outline
export async function courseStatsFromOutline(siteLocation, siteData = null, ancestor = null, dataInclude = null) {
  // get youtube data
  const site = await resolveSiteData(siteLocation, siteData);
  // support slicing the structure to only the branch in question
  // this will set the "root" for buildind an HTML structure to be something different than
  // null and as a result will build the whole site
  let items = [];
  // filter out unpublished pages for our stat generation
  if (ancestor != null) {
    items = site.findBranch(ancestor).filter(function(el) {
      if (el && el.metadata && el.metadata.published) {
        return true;
      }
      return false;
    });
  }
  else {
    items = site.orderTree(site.items).filter(function(el) {
      if (el && el.metadata && el.metadata.published === false) {
        return false;
      }
      return true;
    });
  }
  // parse dom of the content of the site relative to ancestor
  const html = await siteHTMLContent(siteLocation, siteData, ancestor);
  const doc = parse(`<div id="wrapper">${html}</div>`);
  var data = {};
  if (dataInclude === null) {
    dataInclude = ['pages','audio', 'pageType', 'selfChecks', 'objectives', 'authorNotes', 'images', 'h5p', 'headings', 'dataTables','specialTags', 'links', 'placeholders', 'siteremotecontent','readTime','video'];
  }
  for (let inc of dataInclude) {
    switch (inc) {
      case 'pages':
        data[inc] = items.length;
      break;
      case 'pageType':
        data[inc] = items.length;
      break;
      case 'audio':
        data[inc] = doc.querySelectorAll('audio,audio-player').length;
      break;
      case 'selfChecks':
        data[inc] = doc.querySelectorAll('iframe.entity_iframe:not(.elmsmedia_h5p_content),self-check,multiple-choice').length;
      break;
      case 'h5p':
        data[inc] = doc.querySelectorAll('iframe.elmsmedia_h5p_content,iframe[src*="h5p/embed"]').length;
      break;
      case 'objectives':
        data[inc] = doc.querySelectorAll('instruction-card[type="objectives"] li').length;
      break;
      case 'authorNotes':
        data[inc] = doc.querySelectorAll('page-flag').length;
      break;
      case 'images':
        data[inc] = doc.querySelectorAll('media-image,img,simple-img').length;
      break;
      case 'headings':
        data[inc] = doc.querySelectorAll('h1,h2,h3,h4,h5,h6,relative-heading').length;
      break;
      case 'dataTables':
        data[inc] = doc.querySelectorAll('table').length;
      break;
      case 'specialTags':
        data[inc] = doc.querySelectorAll('*:not(p,div,h1,h2,h3,h4,h5,h6,table,bold,li,ul,ol,span,a,em,b,i,strike,u,code,pre,img,hr,tr,td,th)').length;
      break;
      case 'links':
        data[inc] = doc.querySelectorAll('a[href^="http://"],a[href^="https://"]').length;
      break;
      case 'placeholders':
        data[inc] = doc.querySelectorAll('place-holder').length;
      break;
      case 'siteremotecontent':
        data[inc] = doc.querySelectorAll('site-remote-content').length;
      break;
      // inner Text with some basic math applied
      case 'readTime':
        // guestimate readTime, assuming words per minute for average adult reading time
        const words = doc.querySelector("#wrapper").innerText.trim().split(/\s+/).length;
        data[inc] = Math.ceil(words / WORDSPERMIN);
      break;
      // get videos, and then attempt to query APIs to obtain total video duration across providers
      case 'video':
        const videos = doc.querySelectorAll('video-player,iframe[src*="youtube.com"],iframe[src*="youtube-nocookie.com"],iframe[src*="vimeo.com"],video[src],video source[src],a11y-media-player');
        data[inc] = videos.length;
        data.videoLength = 0;
        // walk all the video sources and build 1 request for google API about duration data
        // as they allow batches of 50
        var ytVids = [];
        var videoLength = 0;
        for (let el of videos) {
          let urlData = {};
          // ensure we have valid source/src data to draw from
          if (el.getAttribute('source')) {
            if (el.getAttribute('source').includes("https://")) {
              urlData = new URL(el.getAttribute('source'));
            }
            else {
              let tmp = new URL(siteLocation);
              urlData = new URL(tmp.origin + el.getAttribute('source'));
            }
          }
          else if (el.getAttribute('src')) {
            if (el.getAttribute('src').includes("https://") || el.getAttribute('src').includes("http://")) {
              urlData = new URL(el.getAttribute('src'));
            }
            else {
              let tmp = new URL(siteLocation);
              urlData = new URL(tmp.origin + el.getAttribute('src'));
            }
          }
          if (urlData.origin) {
            // support the 3 variations of youtube link
            switch (urlData.origin) {
              case 'https://www.youtube-nocookie.com':
              case 'https://www.youtube.com':
                if (urlData?.searchParams?.v) {
                  ytVids.push(urlData.searchParams.v);
                }
                else if (urlData.pathname.startsWith('/embed/')) {
                  ytVids.push(urlData.pathname.replace('/embed/',''));
                }
              break;
              case 'https://youtu.be':
                ytVids.push(urlData.pathname.replace('/',''));
              break;
              case 'https://vimeo.com':
              case 'https://player.vimeo.com':
                // no batching in vimeo oembed API
                let vimData = await fetch(`https://vimeo.com/api/oembed.json?url=${urlData.href}`).then((d) => d.ok ? d.json(): {});
                if (vimData?.duration) {
                  videoLength += parseInt(vimData.duration);
                }
              break;
              case 'https://media.aanda.psu.edu':
                // ensure we have an id param
                if (el.getAttribute('id') && el.getAttribute('id').includes('node-')) {
                  let nid = el.getAttribute('id').replace('node-', '');
                  // elms media server embed code / auto replacement has
                  // the NID included in the id that goes in the page
                  if (nid) {
                    let elmsData = await fetch(`https://media.aanda.psu.edu/node/${nid}.json?deep-load-refs=file`, site.__fetchOptions).then((d) => d.ok ? d.json(): {});
                    // resolve video vs audio
                    if (elmsData?.field_video?.metadata?.duration) {
                      videoLength += parseInt(durationFormatHMSConvert(elmsData.field_video.metadata.duration));
                    }
                    else if (elmsData?.field_audio?.metadata?.duration) {
                      // @todo lump audioLength together?
                      videoLength += parseInt(durationFormatHMSConvert(elmsData.field_audio.metadata.duration));
                    }
                  }
                }
              break;
              default:
                // @todo if a file try to read metadata off it
                // if elsewhere, ignore.
              break;
            }
          }
        }
        // make sure we found videos
        if (ytVids.length > 0) {
          let tmp = [];
          for (let i=0; i< ytVids.length; i++) {
            if (tmp.length === 50) {
              videoLength += parseInt(await getYoutubeDuration(tmp.join(',')));
              tmp = [];
            }
            tmp.push(ytVids[i]);
          }
          if (tmp.length > 0) {
            videoLength += parseInt(await getYoutubeDuration(tmp.join(',')));
          }
        }
        data.videoLength = videoLength;
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
      // find all content and return details about what's included on specific pages
      case 'contentData':
        data.contentData = [];
        let contentItems = doc.querySelectorAll('div[data-jos-item-id]');
        for (let el of contentItems) {
          let itemData = site.getItemById(el.getAttribute('data-jos-item-id'));
          if (itemData.id && itemData.metadata) {
            let itemSel = `div[data-jos-item-id="${itemData.id}"]`;
            const words = doc.querySelector(itemSel).innerText.trim().split(/\s+/).length;
            // dig into things JUST on this page
            data.contentData.push({
              id: itemData.id,
              created: new Date(itemData.metadata.created * 1000).toISOString(),
              updated: new Date(itemData.metadata.updated * 1000).toISOString(),
              title: itemData.title,
              slug: itemData.slug,
              location: itemData.location,
              videos: doc.querySelectorAll(`${itemSel} video-player,${itemSel} iframe[src*="youtube.com"],${itemSel} iframe[src*="youtube-nocookie.com"],${itemSel} iframe[src*="vimeo.com"],${itemSel} video,${itemSel} a11y-media-player`).length,
              audio: doc.querySelectorAll(`${itemSel} audio,${itemSel} audio-player`).length,
              placeholders: doc.querySelectorAll(`${itemSel} place-holder`).length,
              siteremotecontent: doc.querySelectorAll(`${itemSel} site-remote-content`).length,
              selfChecks: doc.querySelectorAll(`${itemSel} iframe.entity_iframe:not(.elmsmedia_h5p_content),${itemSel} self-check,${itemSel} multiple-choice`).length,
              h5p: doc.querySelectorAll(`${itemSel} iframe.elmsmedia_h5p_content,${itemSel} iframe[src*="h5p/embed"]`).length,
              objectives: doc.querySelectorAll(`${itemSel} instruction-card[type="objectives"] li`).length,
              authorNotes: doc.querySelectorAll(`${itemSel} page-flag`).length,
              pageType: (itemData.metadata && itemData.metadata.pageType) ? itemData.metadata.pageType : "",
              images: doc.querySelectorAll(`${itemSel} media-image,${itemSel} img,${itemSel} simple-img`).length,
              dataTables: doc.querySelectorAll(`${itemSel} table`).length,
              specialTags: doc.querySelectorAll(`${itemSel} *:not(p,div,h1,h2,h3,h4,h5,h6,table,bold,li,ul,ol,span,a,em,b,i,strike,u,code,pre,img,hr,tr,td,th)`).length,
              links: doc.querySelectorAll(`${itemSel} a[href^="http://"],${itemSel} a[href^="https://"]`).length,
              readTime: Math.ceil(words / WORDSPERMIN)
            });  
          }
        }
      break;
      // find all "media" and return details about where it all lives
      case 'mediaData':
        data.mediaData = [];
        let locType;
        const allMedia = doc.querySelectorAll('audio[src],audio source[src],audio-player,video[src],video source[src],video-player,a11y-media-player,embed,object,iframe[src],media-image,img,simple-img,meme-maker');
        for (let el of allMedia) {
          // obtain which page this shows up on
          let parent = el.parentNode;
          while (parent && !parent.getAttribute('data-jos-item-id')) {
            parent = parent.parentNode;
          }
          let urlData = {};
          locType = 'external';
          let name = 'unknown';
          let source = 'unknown';
          // ensure we have valid source/src data to draw from
          if (el.getAttribute('source')) {
            if (el.getAttribute('source').includes("https://")) {
              urlData = new URL(el.getAttribute('source'));
              source = urlData.toString();
              name = urlData.pathname.split('/').pop();
            }
            else {
              urlData = resolveLocalFile(siteLocation, el.getAttribute('source'));
              locType = 'internal';
              source = urlData.toString();
              name = urlData.pathname.split('/').pop();
            }
          }
          else if (el.getAttribute('src')) {
            if (el.getAttribute('src').includes("https://") || el.getAttribute('src').includes("http://")) {
              urlData = new URL(el.getAttribute('src'));
              source = urlData.toString();
              name = urlData.pathname.split('/').pop();
            }
            else {
              urlData = resolveLocalFile(siteLocation, el.getAttribute('src'));
              locType = 'internal';
              source = urlData.toString();
              name = urlData.pathname.split('/').pop();
            }
          }
          let alt = null;
          // we want the RAW alt attribute if it actually exists
          // this helps resolve the difference between an empty value
          // and no value being supplied
          if (el?._rawAttrs?.alt !== undefined) {
            alt = el._rawAttrs.alt;
          }
          let title = el.getAttribute('title') || null;
          if (title == null && el.getAttribute('media-title')) {
            title = el.getAttribute('media-title');
          }
          let tmp = {
            source: source,
            name: name,
            alt: alt,
            title: title,
            locType: locType,
            type: typeFromElement(el),
            itemId: parent.getAttribute('data-jos-item-id'),
          };
          tmp.status = mediaStatus(tmp);
          data.mediaData.push(tmp);
        }
        // find and mix in the item uploaded file data if it exists
        /*let allParents = doc.querySelectorAll('div[data-jos-item-id]');
        for (let el of allParents) {
          locType = 'internal';
          let itemId = el.getAttribute('data-jos-item-id');
          let parentItem = site.getItemById(itemId);
          // include this file array data if it exists
          if (parentItem?.metadata?.files) {
            for (let file of parentItem.metadata.files) {
              let urlData = resolveLocalFile(siteLocation, file.url);
              data.mediaData.push({
                source: urlData.toString(),
                name: file.name,
                alt: 'internal media reference',
                status: 'info',
                title: '',
                locType: locType,
                type: mimeTypeToMediaType(file.type),
                itemId: itemId,
              });
            }
          }
        }*/
      break;
    }
  }
  return data;
}

// resolve differences in local file referencing
export function resolveLocalFile(siteLocation, path) {
  let tmp = new URL(siteLocation);
  let urlData;
  if (path[0] === '/') {
    urlData = new URL(tmp.origin + path);
  }
  else if (tmp.pathname === '/') {
    urlData = new URL(tmp.origin + tmp.pathname + path);
  }
  else {
    urlData = new URL(tmp.origin + tmp.pathname + '/' + path);
  }
  return urlData;
}

// simple type for tagging purposes
export function typeFromElement(el) {
  switch (el.tagName.toLowerCase()) {
    case 'audio':
    case 'audio-player':
      return 'audio';
    break;
    case'video':
    case'video-player':
    case'a11y-media-player':
      return 'video';
    break;
    case 'embed':
    case 'object':
    case 'iframe':
      if (el.getAttribute('src').includes('youtube.com') || el.getAttribute('src').includes('youtube-nocookie.com') || el.getAttribute('src').includes('vimeo.com')) {
        return 'video';
      }
      else if(el.getAttribute('class').includes('elmsmedia_h5p_content') || el.getAttribute('src').includes('h5p/embed')) {
        return 'h5p';
      }
      return 'other';
    break;
    case 'img':
    case 'simple-img':
    case 'media-image':
      return 'image';
    break;
  }
  return 'other';
}

// common alt issues
export function mediaStatus(item) {
  switch (item.type) {
    case 'audio':
      return 'info';
    break;
    case'video':
      return 'info';
    break;
    case 'other':
      return 'info';
    break;
    case 'image':
      if (item.alt == null || item.alt == "null") {
        return 'error';
      }
      else if (item.name == item.alt || item.source == item.alt) {
        return 'error';
      }
      else if (item.title == item.alt) {
        return 'error';
      }
      else if (item.alt == '') {
        return 'warning';
      }
      else if (item.alt && item.alt.includes('image')) {
        return 'warning';
      }
      else if (item.alt && item.alt.includes('picture')) {
        return 'warning';
      }
      else {
        return 'info';
      }
    break;
  }
  return 'info';
}

// get HTML for a single page + the full object
export async function pageContent(siteLocation, siteData = null, uuid = null, cached = false) {
  let item = {};
  if (uuid) {
    const site = await resolveSiteData(siteLocation, siteData);
    item = site.getItemById(uuid);
    const html = await site.getContentById(uuid, cached);
    const doc = parse(`<div id="wrapper">${html}</div>`);
    let urlData = {};
    const mediaNodesToResolvePath = doc.querySelectorAll('a,audio[src],audio source[src],audio-player,video[src],video source[src],video-player,a11y-media-player,embed,object,iframe[src],media-image,img,simple-img,meme-maker');
    for (let el of mediaNodesToResolvePath) {
      // ensure we have valid source/src data to draw from
      if (el.getAttribute('source')) {
        if (!el.getAttribute('source').startsWith("https://") && !el.getAttribute('source').startsWith("http://")) {
          urlData = resolveLocalFile(siteLocation, el.getAttribute('source'));
          el.setAttribute('source', urlData.toString());
        }
      }
      else if (el.getAttribute('src')) {
        if (!el.getAttribute('src').startsWith("https://") && !el.getAttribute('src').startsWith("http://")) {
          urlData = resolveLocalFile(siteLocation, el.getAttribute('src'));
          el.setAttribute('src', urlData.toString());
        }
      }
      else if (el.getAttribute('href')) {
        if (!el.getAttribute('href').startsWith("#") && !el.getAttribute('href').startsWith("http://") && !el.getAttribute('href').startsWith("http://")) {
          urlData = resolveLocalFile(siteLocation, el.getAttribute('href'));
          el.setAttribute('href', urlData.toString());
        }
      }
    }
    item.content = doc.querySelector("#wrapper").innerHTML;
  }
  return item;
}

// get all of the HTML for the site relative to an ancestor starting point
export async function siteHTMLContent(siteLocation, siteData = null, ancestor = null, noTitles = false, textOnly = false) {
  const site = await resolveSiteData(siteLocation, siteData);
  var siteContent = '';
  // support slicing the structure to only the branch in question
  // this will set the "root" for buildind an HTML structure to be something different than
  // null and as a result will build the whole site
  let items = [];
  if (ancestor != null) {
    items = site.findBranch(ancestor);
  }
  else {
    items = site.orderTree(site.items);
  }
  // ordered
  // get every page and stuff it together
  for (var i in items) {
    // default is to send titles as h1 since they are full pages
    if (!noTitles) {
      siteContent += `<h1>${items[i].title}</h1>`;
    }
    let content = await site.getContentById(items[i].id, true);
    siteContent += `<div data-jos-item-id="${items[i].id}">${content}</div>`;
  }
  // support stripping HTML if goal was purely text
  if (textOnly) {
    const doc = parse(`<div id="wrapper">${siteContent}</div>`);
    siteContent = doc.innerText;
  }
  return siteContent;
}

// get duration, supports multiple in 1 request
export async function getYoutubeDuration(vid) {
  var duration = 0;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${process.env.YOUTUBE_API_KEY}&id=${vid}`;
  const ytData = await fetch(url).then((d) => d.ok ? d.json(): {});
  if (ytData?.items) {
    for (const item of ytData.items) {
      duration += parseInt(YTDurationFormatConvert(item.contentDetails.duration));
    }
    return duration;
  }
  return 0;
}

// convert youtube format to seconds for duration
export function YTDurationFormatConvert(input) {
  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0, minutes = 0, seconds = 0, totalseconds;

  if (reptms.test(input)) {
    var matches = reptms.exec(input);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
    totalseconds = hours * 3600  + minutes * 60 + seconds;
  }
  return totalseconds;
}

// https://stackoverflow.com/questions/9640266/convert-hhmmss-string-to-seconds-only-in-javascript
export function durationFormatHMSConvert(input) {
  let a = input.split(':');
  let seconds = 0;
  if (a.length === 3) {
    let t=0;
    if (a[0] !== '0') {
      t = parseInt(a[0]) * 60 * 60;
    }
    if (a[1] !== '0') {
      t+= parseInt(a[1]) * 60;
      
    }
    if (a[2] !== '0') {
      t+= parseInt(a[2]);      
    }
    seconds+=t;
  }
  else if (a.length === 2) {
    let t=0;
    if (a[0] !== '0') {
      t+= parseInt(a[0]) * 60;
      
    }
    if (a[1] !== '0') {
      t+= parseInt(a[1]);      
    }
    seconds+=t;
  }
  else if (a.length === 1) {
    let t=0;
    if (a[0] !== '0') {
      t = parseInt(a[0]);
    }
    seconds+=t;
  }
  return seconds;
}

// simple mimeType to media type
export function mimeTypeToMediaType(mime) {
  let parts = mime.split("/");
  switch (parts[0]) {
    case "audio":
      return "audio";
    break;
    case "image":
      return "image";
    break;
    case "video":
      return "video";
    break;
    case "text":
      return "document";
    break;
    case "application":
      return "document";
    break;
  }
}

/**
 * Clean up a title / sanitize the input string for file system usage
 */
export function cleanTitle(value) {
  let cleanTitle = value.trim();
  cleanTitle = cleanTitle.split(" ").join("");
  cleanTitle = cleanTitle.replace(/\s/, '-').toLowerCase();
  cleanTitle = cleanTitle.replace(/[^\w\-\/\s]+/u, '-');
  cleanTitle = cleanTitle.replace(/--+/u, '-');
  cleanTitle = cleanTitle.replace(/,/g, '').replace(/:/g, '').replace(/\?/g, '');
  // ensure we don't return an empty title or it could break downstream things
  if (cleanTitle == '') {
      cleanTitle = 'blank';
  }
  return cleanTitle;
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export function validURL(str) {
  let url;
  // if we fail to load, we don't have a valid URL
  try {
    url = new URL(str);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}