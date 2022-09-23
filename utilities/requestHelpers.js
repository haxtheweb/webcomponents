// standard helper for post body processing
export function stdPostBody(req) {
  try {
    return JSON.parse(req.body);
  }
  catch(e) {
    // empty body response
    return null
  }
}

// failed request for standardized response
export function invalidRequest(res, reason, status = 400) {
  return res.status(status).json({
    status: status,
    reason: reason
  });
}

// standard response w/ headers
export function stdResponse(res, data = {}, respOptions = {}) {
  const headers = {
    status: 200,
    methods: "OPTIONS, POST, GET, HEAD",
    origin: "*",
    headers: "X-CSRF-Token, X-Requested-With, Disposition, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    credentials: "true",
    ...respOptions
  };
  res.setHeader("Access-Control-Allow-Methods", headers.methods);
  res.setHeader("Access-Control-Allow-Origin", headers.origin);
  res.setHeader("Access-Control-Allow-Credentials", headers.credentials);
  res.setHeader("Access-Control-Allow-Headers", headers.headers);
  // cache is opt in but also support buster flag to ensure we force NOT hitting a cache
  if (headers.cache) {
    res.setHeader('Cache-Control', `max-age=0, s-maxage=${headers.cache}, stale-while-revalidate=${headers.cache}`);
  }
  // helps w/ type setting
  if (headers.disposition) {
    res.setHeader('Content-Disposition', headers.disposition);
  }
  // length for file download / streaming support
  if (headers.length) {
    res.setHeader('Content-Length', headers.length);
  }
  // support non-json based responses. If type is set for content type
  // then we just send the status / data in the format provided
  if (headers.type) {
    res.setHeader('Content-Type', headers.type);
    return res.status(headers.status).send(data);
  }
  else {
    return res.status(headers.status).json({
      status: headers.status,
      data: data
    });
  }
}
