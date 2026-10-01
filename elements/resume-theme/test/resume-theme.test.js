import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../resume-theme.js";

describe("ResumeTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <resume-theme title="title"></resume-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

// Round 8 coverage (#3079): behavioral suite for the resume-theme
// single-page resume. Store state is driven via the singleton
// save/restore pattern (see hax-body/test/hax-store.test.js).
describe("ResumeTheme behavior", () => {
  let element;
  let savedManifest;
  let savedActiveId;
  let savedColorScheme;
  const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    // lock light scheme for the a11y audits (see spacebook-theme tests)
    savedColorScheme = document.documentElement.style.colorScheme;
    document.documentElement.style.colorScheme = "light";
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
    if (savedColorScheme === "") {
      document.documentElement.style.removeProperty("color-scheme");
    } else {
      document.documentElement.style.colorScheme = savedColorScheme;
    }
  });

  afterEach(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  beforeEach(async () => {
    element = await fixture(html` <resume-theme></resume-theme> `);
    await element.updateComplete;
  });

  it("seeds constructor defaults", () => {
    expect(element.siteTitle).to.equal("");
    expect(element.siteDescription).to.equal("");
    expect(element.authorName).to.equal("");
    expect(element.authorImage).to.equal("");
    expect(element.authorEmail).to.equal("");
    expect(element.authorPhone).to.equal("");
    expect(element.authorLocation).to.equal("");
    expect(element.authorWebsite).to.equal("");
    expect(element.authorWebsite2).to.equal("");
    expect(element.authorSocialLink).to.equal("");
    expect(element.authorSocialLink2).to.equal("");
    // autorun mirrors the (null) store values
    expect(element.manifest).to.equal(null);
    expect(element.activeItem).to.equal(null);
  });

  it("renders the empty resume structure", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link").getAttribute("href")).to.equal(
      "#contentcontainer",
    );
    const sidebar = root.querySelector("aside.sidebar[part='sidebar']");
    expect(sidebar.getAttribute("aria-label")).to.equal(
      "Contact information",
    );
    expect(
      root.querySelector("div.avatar-wrapper[part='avatar-wrapper']") === null,
    ).to.equal(false);
    // no author image → initials placeholder, 'R' without a name
    const placeholder = root.querySelector("div.avatar-placeholder[part='avatar']");
    expect(placeholder.getAttribute("aria-label")).to.equal("");
    expect(placeholder.textContent.trim()).to.equal("R");
    // no name → no h1
    expect(root.querySelector("h1.name")).to.equal(null);
    expect(root.querySelector("p.subtitle").textContent).to.equal("");
    // no contact data → no contact items
    expect(root.querySelectorAll("div.contact-item").length).to.equal(0);
    expect(root.querySelector("main.main-content[role='main']") === null).to.equal(
      false,
    );
    expect(root.querySelector("#contentcontainer #slot slot") === null).to.equal(
      false,
    );
  });

  it("reads site and author data from the manifest", async () => {
    store.manifest = {
      title: "Resume Site",
      metadata: {
        site: { name: "Jane Doe", description: "Senior rocket scientist" },
        author: {
          name: "Jane Doe",
          image: "jane.jpg",
          email: "jane@example.com",
          phone: "+1-814-863-0000",
          location: "State College, PA",
          website: "https://jane.example.com",
          website2: "https://blog.jane.example.com",
          socialLink: "https://www.linkedin.com/in/jane",
          socialLink2: "https://github.com/jane",
        },
      },
      items: [],
    };
    await tick();
    await element.updateComplete;
    expect(element.siteTitle).to.equal("Jane Doe");
    expect(element.siteDescription).to.equal("Senior rocket scientist");
    expect(element.authorName).to.equal("Jane Doe");
    expect(element.authorImage).to.equal("jane.jpg");
    expect(element.authorEmail).to.equal("jane@example.com");
    expect(element.authorPhone).to.equal("+1-814-863-0000");
    expect(element.authorLocation).to.equal("State College, PA");
    expect(element.authorWebsite).to.equal("https://jane.example.com");
    expect(element.authorWebsite2).to.equal("https://blog.jane.example.com");
    expect(element.authorSocialLink).to.equal(
      "https://www.linkedin.com/in/jane",
    );
    expect(element.authorSocialLink2).to.equal("https://github.com/jane");
    // rendered avatar, name, subtitle
    const root = element.shadowRoot;
    const avatar = root.querySelector("img.avatar[part='avatar']");
    expect(avatar.getAttribute("src")).to.equal("jane.jpg");
    expect(avatar.getAttribute("alt")).to.equal("Jane Doe");
    expect(root.querySelector("h1.name").textContent).to.equal("Jane Doe");
    expect(root.querySelector("p.subtitle").textContent).to.equal(
      "Senior rocket scientist",
    );
    // all seven contact items render
    const items = [...root.querySelectorAll("div.contact-item")];
    expect(items.length).to.equal(7);
    const emailLink = root.querySelector(
      "div.contact-item a[href='mailto:jane@example.com']",
    );
    expect(emailLink.textContent).to.equal("jane@example.com");
    expect(
      root.querySelector("div.contact-item a[href='tel:+1-814-863-0000']")
        .textContent,
    ).to.equal("+1-814-863-0000");
    expect(
      root.querySelector(
        "div.contact-item span[part='contact-text']",
      ).textContent,
    ).to.equal("State College, PA");
    const siteLink = root.querySelector(
      "div.contact-item a[href='https://jane.example.com']",
    );
    expect(siteLink.getAttribute("target")).to.equal("_blank");
    expect(siteLink.getAttribute("rel")).to.equal("noopener noreferrer");
    // protocol is stripped from the visible website label
    expect(siteLink.textContent).to.equal("jane.example.com");
    const blogLink = root.querySelector(
      "div.contact-item a[href='https://blog.jane.example.com']",
    );
    expect(blogLink.textContent).to.equal("blog.jane.example.com");
    // social links resolve platform icons and labels
    const socialLink = root.querySelector(
      "div.contact-item a[href='https://www.linkedin.com/in/jane']",
    );
    expect(socialLink.textContent).to.equal("LinkedIn");
    expect(socialLink.getAttribute("target")).to.equal("_blank");
    expect(
      root.querySelector(
        "div.contact-item a[href='https://www.linkedin.com/in/jane']",
      ).parentNode.parentNode.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("mdi-social:linkedin");
    const socialLink2 = root.querySelector(
      "div.contact-item a[href='https://github.com/jane']",
    );
    expect(socialLink2.textContent).to.equal("GitHub");
  });

  it("falls back to author initials without an image", async () => {
    element.authorName = "Jane Doe";
    await element.updateComplete;
    const placeholder = element.shadowRoot.querySelector(
      "div.avatar-placeholder",
    );
    expect(placeholder.textContent.trim()).to.equal("JD");
    expect(placeholder.getAttribute("aria-label")).to.equal("Jane Doe");
    element.authorName = "Soloproject";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelector("div.avatar-placeholder").textContent
        .trim(),
    ).to.equal("S");
  });

  it("maps social urls to icons", () => {
    expect(element.socialLinkIcon("")).to.equal("icons:launch");
    expect(element.socialLinkIcon(null)).to.equal("icons:launch");
    expect(element.socialLinkIcon("https://www.linkedin.com/in/jane")).to.equal(
      "mdi-social:linkedin",
    );
    expect(element.socialLinkIcon("https://github.com/jane")).to.equal(
      "mdi-social:github-circle",
    );
    expect(element.socialLinkIcon("https://gitlab.com/jane")).to.equal(
      "mdi-social:github-circle",
    );
    expect(element.socialLinkIcon("https://twitter.com/jane")).to.equal(
      "mdi-social:twitter",
    );
    expect(element.socialLinkIcon("https://x.com/jane")).to.equal(
      "mdi-social:twitter",
    );
    expect(element.socialLinkIcon("https://t.co/jane")).to.equal(
      "mdi-social:twitter",
    );
    expect(element.socialLinkIcon("https://facebook.com/jane")).to.equal(
      "mdi-social:facebook",
    );
    expect(element.socialLinkIcon("https://fb.me/jane")).to.equal(
      "mdi-social:facebook",
    );
    expect(element.socialLinkIcon("https://instagram.com/jane")).to.equal(
      "mdi-social:instagram",
    );
    expect(element.socialLinkIcon("https://youtube.com/jane")).to.equal(
      "mdi-social:youtube",
    );
    expect(element.socialLinkIcon("https://youtu.be/jane")).to.equal(
      "mdi-social:youtube",
    );
    expect(element.socialLinkIcon("https://tiktok.com/@jane")).to.equal(
      "mdi-social:tiktok",
    );
    expect(element.socialLinkIcon("https://example.com")).to.equal(
      "icons:launch",
    );
  });

  it("maps social urls to labels", () => {
    expect(element.socialLinkLabel("")).to.equal("Link");
    expect(element.socialLinkLabel("https://www.linkedin.com/in/jane")).to.equal(
      "LinkedIn",
    );
    expect(element.socialLinkLabel("https://github.com/jane")).to.equal(
      "GitHub",
    );
    expect(element.socialLinkLabel("https://gitlab.com/jane")).to.equal(
      "GitLab",
    );
    expect(element.socialLinkLabel("https://twitter.com/jane")).to.equal(
      "X / Twitter",
    );
    expect(element.socialLinkLabel("https://x.com/jane")).to.equal(
      "X / Twitter",
    );
    expect(element.socialLinkLabel("https://facebook.com/jane")).to.equal(
      "Facebook",
    );
    expect(element.socialLinkLabel("https://instagram.com/jane")).to.equal(
      "Instagram",
    );
    expect(element.socialLinkLabel("https://youtube.com/jane")).to.equal(
      "YouTube",
    );
    expect(element.socialLinkLabel("https://tiktok.com/@jane")).to.equal(
      "TikTok",
    );
    expect(element.socialLinkLabel("https://example.com")).to.equal("Social");
  });

  it("renders nothing for an empty social link", () => {
    expect(element.renderSocialLink("")).to.equal("");
    expect(element.renderSocialLink(null)).to.equal("");
  });

  it("runs disposers on disconnect", async () => {
    const el = await fixture(html` <resume-theme></resume-theme> `);
    el.remove();
    expect(Array.isArray(el.__disposer)).to.equal(true);
    expect(el.__disposer.length).to.equal(0);
  });

  it("passes the a11y audit with full contact data", async () => {
    store.manifest = {
      title: "Resume Site",
      metadata: {
        site: { name: "Jane Doe", description: "Senior rocket scientist" },
        author: {
          name: "Jane Doe",
          image: "jane.jpg",
          email: "jane@example.com",
          phone: "+1-814-863-0000",
          location: "State College, PA",
          website: "https://jane.example.com",
          socialLink: "https://www.linkedin.com/in/jane",
        },
      },
      items: [],
    };
    await tick();
    await element.updateComplete;
    // Evidence for the color-contrast ignore below: the sidebar sheet
    // actually resolves to the dark nittanyNavy (#001e44 / rgb(0, 30, 68))
    // under the locked light color scheme, with white text on top — a
    // passing contrast pair. The white-on-near-white values axe reports
    // in this headless harness (backgrounds like #fdfefe that match no
    // stylesheet state) are the known racy light-dark()/axe resolution
    // documented in the spacebook-theme and collection-list suites.
    const sidebar = element.shadowRoot.querySelector("aside.sidebar");
    expect(getComputedStyle(sidebar).backgroundColor.includes("rgb(0, 30, 68")).to.equal(
      true,
    );
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["color-contrast"],
    });
  });
});
