import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import rs from "text-readability";
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
    const data = {
      gradeLevel: rs.textStandard(text, true), // grade level from multiple tests averaged
      difficultWords: rs.difficultWords(text), // difficult words
      syllableCount: rs.syllableCount(text), // sylables
      lexiconCount: rs.lexiconCount(text), // word count
      sentenceCount: rs.sentenceCount(text), // sentences
    };
    res = stdResponse(res, data, {methods: "OPTIONS, POST" });
  }
  else {
    res = invalidRequest(res, 'missing `text` param');
  }
}