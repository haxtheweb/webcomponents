import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import { textVide } from 'text-vide';
export default async function handler(req, res) {
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.body) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  const text = body.body;
  if (text) {
    const highlightedText = textVide(text, { fixationPoint: body.fixationPoint ? parseInt(body.fixationPoint) : 4 });
    res = stdResponse(res, highlightedText, {cache: 86400, methods: "OPTIONS, POST" });
  }
  else {
    res = invalidRequest(res, 'missing `text` param');
  }
}