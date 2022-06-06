// standard helper for post body processing
export function stdPostBody(req, res) {
  try {
    return {
      body: JSON.parse(req.body)
    };
  }
  catch(e) {
    // empty body response
    return {
      body: null
    }
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
export function stdResponse(res, data = {}, status = 200) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.status(status).json({
    status: status,
    data: data
  });
}
