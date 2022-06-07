import { fetch, stdResponse, invalidRequest } from "../../utils/requestHelpers.js";
import pkg from 'sharp';
const sharp = pkg;

export default async function handler(req, res) {
  // get the image possible options
  const options = {
    src: req.query.src ? req.query.src : null,
    width: req.query.width ? parseInt(req.query.width) : null,
    height: req.query.height ? parseInt(req.query.height) : null,
    quality: req.query.quality ? parseInt(req.query.quality) : 80,
    fit: req.query.fit ? req.query.fit : "contain",
    rotate: req.query.rotate ? req.query.rotate : null,
    format: req.query.format ? req.query.format : 'jpg',
  };
  // we don't require anything really as this could just be a simple quality convert
  // and leveraging the Edge caching engine
  if (!src) {
    res = invalidRequest(res, 'missing src');
  }
  else {
    // get image source and convert to sharp object for processing
    const imgSource = await fetch(options.src);
    const imgBuffer = Buffer.from(await imgSource.arrayBuffer())
    var img = sharp(imgBuffer);

    // optional rotation support
    if (options.rotate) {
      img = img.rotate(options.rotate);
    }
    // need a fit param if we have w/h otherwise just resize 1 direction
    if (options.width && options.height) {
      img = img.resize({width: options.width, height: options.height, fit: options.fit});
    }
    else if (options.width) {
      img = img.resize({width: options.width});
    }
    else if (options.height) {
      img = img.resize({height: options.height});
    }
    // convert to jpeg / quality modification if possible
    switch (options.format) {
      case 'png':
        img = img.png();
      break;
      case 'webp':
        img = img.webp({ lossless: true });
      break;
      case 'gif':
        img = img.gif();
      break;
      case 'jpg':
      case 'jpeg':
      default:
        img = img.jpeg({ mozjpeg: true, quality: options.quality });
      break;
    }
    stdResponse(res,await img.toBuffer(),{methods: "GET,OPTIONS", cache: 1800, type:'image/jpeg'});
  }
}