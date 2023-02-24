// MD5 operations on a string
import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import crypto from "crypto";

const hashKey = `haxIsFuf342f4nFo3t4t5g67kyutyhrewrSomePeopu76jujyhgle`;

export default async function handler(req, res) {
  let body = {};
  let op = null;
  let data = null;
  if (req.query.op) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  // fallback support for post
  if (body && body.op) {
    op = body.op;
    data = body.data;
  }
  // need to know what we're searching for otherwise bail
  if (op && data) {
    let returnData = null;
    if (op === "hash") {
      returnData = encrypt(hashKey, data);
    }
    else {
      returnData = decrypt(hashKey, data);
    }
    res = stdResponse(res, returnData, {cache: 86400, methods: "OPTIONS, POST" });
  }
  else {
    // invalidate the response and provide a reason
    // this optionally takes in a status code otherwise default is 400
    // vercel will through a 500 if there was any bricking issue so we don't
    // need to throw that most likely
    res = invalidRequest(res, 'missing `op` or `data` param');
  }
}



function encrypt(key, data) {

  let keyHash = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);

  const iv = Buffer.alloc(16, 0);
  var cipher = crypto.createCipheriv('aes-256-ctr', keyHash, iv);
  var crypted = cipher.update(data, 'utf-8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(key, data) {
  let keyHash = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
  const iv = Buffer.alloc(16, 0);
  var decipher = crypto.createDecipheriv('aes-256-ctr', keyHash, iv);
  var decrypted = decipher.update(data, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}