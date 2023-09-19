import { stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";

// vercel to slice our data into views that we can remix at will
export default async function handler(req, res) {
  // cache for a day
  let options = {
    cache: 60 * 60 * 24
  };
  // process.env.HAX_STATS has our stats compiled by our staging system
  let data = await fetch(process.env.HAX_STATS).then((res) => {
    return res.json()
  });
  if (data) {
    res = stdResponse(res, data || [], options);
  }
  else {
    res = invalidRequest(res, 'data from stats failed to load');
  }
}
