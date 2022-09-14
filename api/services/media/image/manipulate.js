import { stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
import pkg from 'sharp';
const sharp = pkg;

export default async function handler(req, res) {
  // get the image possible options
  const options = {
    src: req.query.src ? req.query.src : null,
    watermark: req.query.watermark ? req.query.watermark : null,
    width: req.query.width ? parseInt(req.query.width) : null,
    height: req.query.height ? parseInt(req.query.height) : null,
    quality: req.query.quality ? parseInt(req.query.quality) : 80,
    fit: req.query.fit ? req.query.fit : "cover",
    rotate: req.query.rotate ? parseInt(req.query.rotate) : null,
    format: req.query.format ? req.query.format : 'jpg',
    wmspot: req.query.wmspot ? req.query.wmspot : 'se',
  };
  // we don't require anything really as this could just be a simple quality convert
  // and leveraging the Edge caching engine
  if (!options.src) {
    res = invalidRequest(res, 'missing src');
  }
  else {
    // get image source and convert to sharp object for processing
    const imgSource = await fetch(options.src);
    const imgBuffer = Buffer.from(await imgSource.arrayBuffer())
    var img = sharp(imgBuffer);

    // optional support for watermark
    if (options.watermark) {
      const waterMarkSrc = await fetch(options.watermark);
      const waterMarkBuff = Buffer.from(await waterMarkSrc.arrayBuffer());
      const waterMark = sharp(waterMarkBuff);
      var gravity;
      switch (options.wmspot) {
        case 'sw':
          gravity = 'southwest';
        break;
        case 'ne':
          gravity = 'northeast';
        break;
        case 'nw':
          gravity = 'northwest';
        break;
        default:
        case 'se':
          gravity = 'southeast';
        break;
      }
      img.composite([{ input: await waterMark.toBuffer(), gravity: gravity}]);
    }
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
    stdResponse(res,await img.toBuffer(),{cache: 1800, type:'image/jpeg'});
  }
}