import { JSONOutlineSchema } from "./JSONOutlineSchema.js";
import { parse } from 'node-html-parser';
import fetch from "node-fetch";
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
      await site.load(`${siteLocation}`, site.__fetchOptions);
      // location isn't at site.json bc this is generated path
      // so we need to lob this off from the path instead of site.json
      if (siteLocation.includes('/haxapi/loadJOS/')) {
        let urlData = new URL(siteLocation);``
        site.__siteFileBase = urlData.pathname;
      }
    }
    else {
      await site.load(`${siteLocation}/site.json`);
    }
  }
  return site;
}

// generate stats given a location within the outline
export async function courseStatsFromOutline(siteLocation, siteData = null, ancestor = null) {
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
  // guestimate readTime, assuming 225 words per minute for average adult reading time
  const words = doc.querySelector("#wrapper").innerText.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / 225);
  const data = {
    pages: items.length,
    video: doc.querySelectorAll('video-player,iframe[src*="youtube.com"],iframe[src*="vimeo.com"],video[src],video source[src],a11y-media-player').length,
    audio: doc.querySelectorAll('audio[src],audio source[src],audio-player').length,
    selfChecks: doc.querySelectorAll('iframe.entity_iframe,self-check,multiple-choice').length,
    objectives: doc.querySelectorAll('instruction-card[type="objectives"] li').length,
    images: doc.querySelectorAll('media-image,img,simple-img').length,
    headings: doc.querySelectorAll('h1,h2,h3,h4,h5,h6,relative-heading').length,
    readTime: readTime,
    dataTables: doc.querySelectorAll('table').length,
    links: doc.querySelectorAll('a').length,
    specialTags: doc.querySelectorAll('*:not(p,div,h1,h2,h3,h4,h5,h6,table,bold,li,ul,ol,span,a,em,b,i,strike,u,code,pre,img,hr,tr,td,th)').length,
    videoLength: 0,
  };
  // walk all the video sources and build 1 request for google API about duration data
  // as they allow batches of 50
  var ytVids = [];
  var videoLength = 0;
  doc.querySelectorAll('video-player,iframe[src*="youtube.com"],iframe[src*="vimeo.com"],video[src],video source[src],a11y-media-player').forEach( async (el) => {
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
              console.log(`request: https://media.aanda.psu.edu/node/${nid}.json?deep-load-refs=file`);
              let elmsData = await fetch(`https://media.aanda.psu.edu/node/${nid}.json?deep-load-refs=file`, site.__fetchOptions).then((d) => d.ok ? d.json(): {});
              console.log(elmsData);
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
  });
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
  return data;
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
    let content = await site.getContentById(items[i].id);
    siteContent += content;
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
    ytData.items.forEach((item) => {
      duration += parseInt(YTDurationFormatConvert(item.contentDetails.duration));
    })
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