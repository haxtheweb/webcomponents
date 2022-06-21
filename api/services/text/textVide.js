// duckduckgo.js
// this is an example to fork from that uses common, simple conventions
// for getting data, validating data, and responding in a consistent way.
import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import { textVide } from 'text-vide';
export default async function handler(req, res) {
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  const text = body.text;
  if (text) {
    const highlightedText = textVide(text, { fixationPoint: 4 });
    res = stdResponse(res, highlightedText, {cache: 86400, methods: "OPTIONS, POST" });
  }
  else {
    res = invalidRequest(res, 'missing `text` param');
  }
}