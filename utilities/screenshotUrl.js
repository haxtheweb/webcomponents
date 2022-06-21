import { getBrowserInstance } from './getBrowserInstance.js';
import { stdResponse, invalidRequest, stdPostBody } from "./requestHelpers.js";

// this requires its own service instance and can't live with the monorepo
// due to the size of the dependencies involved
export default async function handler(req, res) {
  const body = stdPostBody(req);
  const urlToCapture = body.urlToCapture;
  // Perform URL validation
  if (!urlToCapture || !urlToCapture.trim()) {
    res = invalidRequest(res, 'enter a valid url');
  }
  else {
    if (!urlToCapture.includes("https://")) {
      // try to fake it
      urlToCapture = `https://${urlToCapture}`;
    }

    // capture options
    var browserGoToOptions = {
      timeout: 10000,
      waitUntil: 'networkidle2',
    };
    var screenshotOptions = {
      quality: body.quality ? parseInt(body.quality) : 75,
      type: 'jpeg',
      encoding: "base64"
    };
    var base64 = '';
    let browser = null
    try {
      browser = await getBrowserInstance();
      let page = await browser.newPage();
      await page.goto(urlToCapture, browserGoToOptions);
      // special support for isolating a tweet
      if (urlToCapture.includes('twitter.com')) {
        await page.waitForSelector("article[data-testid='tweet']");
        const element = await page.$("article[data-testid='tweet']");
        base64 = await element.screenshot(screenshotOptions);
      }
      else {
        screenshotOptions.fullPage = true;
        base64 = await page.screenshot(screenshotOptions);
      }
      res = stdResponse(res,
        {
          url: urlToCapture,
          image: base64
        }, {
          methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          cache: 1800
        }
      );
    } catch (error) {
        console.log(error)
        res = invalidRequest(res, 'something went wrong', 500);
    } finally {
        if (browser !== null) {
            await browser.close()
        }
    }
  }
}