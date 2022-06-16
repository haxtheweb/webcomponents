import { MicroFrontendRegistry } from "../micro-frontend-registry.js";

// integrate the core services of our lrnwebcomponents API layer
// While not required, this is the home for non-visual aspects of
// our ecosystem that can be leveraged independent of other things
// Examples of a platform specific implementation would be HAXcms
// and it's name spacing

export function enableServices(services) {
  services.forEach((service) => {
    switch (service) {
      case 'core':
        enableCoreServices();
      break;
      case 'experimental':
        enableExperimentalServices();
      break;
      case 'haxcms':
        enableHAXcmsServices();
      break;
    }
  });
}

// core services
export function enableCoreServices() {
  // mdToHtml
  MicroFrontendRegistry.add({
    endpoint: '/api/services/media/format/mdToHtml',
    name: '@core/mdToHtml',
    title: 'Markdown to HTML',
    description: 'Convert Markdown string (or file) to HTML',
    params: {
      md: "MD or link to be converted",
      type: "link for processing as link otherwise unused",
    }
  });

  // htmlToMd
  MicroFrontendRegistry.add({
    endpoint: '/api/services/media/format/htmlToMd',
    name: '@core/htmlToMd',
    title: 'HTML to MD',
    description: 'Convert HTML string (or file) to MD',
    params: {
      html: "HTML or link to be converted",
      type: "link for processing as link otherwise unused",
    }
  });

  // duckDuckGo
  MicroFrontendRegistry.add(
    {
      endpoint: '/api/services/website/duckDuckGo',
      name: '@core/duckDuckGo',
      title: 'Duck Duck Go',
      description: 'Search results from duck duck go',
      params: {
        q: "query param to search on"
      }
    }
  );

  // docxToPdf
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/docxToPdf",
    name: "@core/docxToPdf",
    title: "Docx to pdf",
    description: "Convert .docx file to PDF response (downloaded)",
    params: {
      body: "FormData class w/ uploaded file encoded into it"
    }
  });

  // docxToHtml
  MicroFrontendRegistry.add({
    endpoint: '/api/services/media/format/docxToHtml',
    name: "@core/docxToHtml",
    title: "Docx to HTML",
    description: "Convert .docx file to HTML",
    params: {
      body: "FormData class w/ uploaded file encoded into it"
    }
  });

  // imgToAscii
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/imgToAscii",
    name: "@core/imgToAscii",
    title: "Image to ascii art",
    description: "Convert any valid image formatted file to ASCII terminal style art",
    params: {
      body: "FormData class w/ uploaded file encoded into it"
    }
  });

  // imgManipulation
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/image/manipulate",
    name: "@core/imgManipulate",
    title: "simple image manipulation",
    description: "scale, resize, convert and perform operations to manipulate any image",
    params: {
      src: "image source",
      height: "height in numbers",
      width: "width in numbers",
      quality: "0-100, jpeg quality to reduce image by if jpeg",
      fit: "how to crop if height and width are supplied (https://sharp.pixelplumbing.com/api-resize)",
      watermark: "SRC for an image to watermark on the output",
      wmspot: "nw,ne,se,sw for moving the location of the watermark",
      rotate: "https://sharp.pixelplumbing.com/api-operation#rotate",
      format: "png, jpg, gif, webp",
    },
  });
}

// HAXcms services
export function enableHAXcmsServices() {
  // siteToHtml
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/siteToHtml",
    name: "@haxcms/siteToHtml",
    title: "HAXcms Full Site HTML",
    description: "Load entire HAXcms site via URL as HTML",
    params: {
      url: "location of the HAXcms site",
    }
  });

  // siteToEpub
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/siteToEpub",
    name: "@haxcms/siteToEpub",
    title: "HAXcms Full Site EPUB",
    description: "generate .epub of entire HAXcms site via URL",
    params: {
      url: "location of the HAXcms site",
    }
  });
}

// experimental service
export function enableExperimentalServices() {
  // siteToHtml
  MicroFrontendRegistry.add({
    endpoint: "/api/experiments/hydrateSsr",
    name: "@experiments/hydrateSsr",
    title: "Hydrate SSR",
    description: "Hydrate web components via lit server side",
    params: {
      html: "blob of HTML or link to html file to load",
    }
  });
}