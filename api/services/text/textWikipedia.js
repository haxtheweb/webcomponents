import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
export default async function handler(req, res) {
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  const text = body.body;
  if (text) {
    // go hit the wikipedia api
    const terms = [];
    res = stdResponse(res, terms, {cache: 86400, methods: "OPTIONS, POST" });
  }
  else {
    res = invalidRequest(res, 'missing `text` param');
  }
}