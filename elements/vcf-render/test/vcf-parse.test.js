import { expect } from "@open-wc/testing";
import {
  parseVcf,
  parseContentLine,
  safePhotoSource,
  unescapeText,
  unfoldLines,
} from "../lib/vcf-parse.js";

// the sample from haxtheweb/issues#2941, verbatim, including the nested card
// that is folded into the AGENT property
const SAMPLE = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Doe;John;Q.,Public",
  "FN;CHARSET=UTF-8:John Doe",
  "TEL;TYPE=WORK,VOICE:(111) 555-1212",
  "TEL;TYPE=HOME,VOICE:(404) 555-1212",
  "TEL;TYPE=HOME,TYPE=VOICE:(404) 555-1213",
  "EMAIL;TYPE=PREF,INTERNET:forrestgump@example.com",
  "EMAIL;TYPE=INTERNET:example@example.com",
  "ADR;TYPE=HOME:;;42 Plantation St.;Baytown;LA;30314;United States of America",
  "URL:https://www.google.com/",
  "PHOTO;VALUE=URL;TYPE=PNG:http://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Example_svg.svg/200px-Example_svg.svg.png",
  "AGENT:BEGIN:VCARD",
  " VERSION:3.0",
  " N:Doe;John;Q.,Public",
  " FN:John Doe",
  " TEL;TYPE=WORK,VOICE:(111) 555-1212",
  " EMAIL;TYPE=PREF,INTERNET:forrestgump@example.com",
  " END:VCARD",
  "END:VCARD",
].join("\r\n");

describe("vcf-parse line reading", () => {
  it("unfolds a folded line, dropping the break and the one space after it", () => {
    // the fold inserts the break and the whitespace, so both come back out
    expect(unfoldLines("NOTE:one\r\n two")).to.equal("NOTE:onetwo");
    expect(unfoldLines("NOTE:one\r\n\ttwo")).to.equal("NOTE:onetwo");
    expect(unfoldLines("NOTE:one\r\n  two")).to.equal("NOTE:one two");
  });

  it("tolerates no input at all", () => {
    expect(unfoldLines(undefined)).to.equal("");
  });

  it("splits a content line into name, params and value", () => {
    const line = parseContentLine("EMAIL;TYPE=PREF,INTERNET:a@example.com");
    expect(line.name).to.equal("EMAIL");
    expect(line.params.TYPE).to.equal("PREF,INTERNET");
    expect(line.value).to.equal("a@example.com");
  });

  it("reads a vCard 2.1 bare parameter as a type", () => {
    const line = parseContentLine("TEL;WORK;VOICE:555-0100");
    expect(line.params.TYPE).to.equal("WORK,VOICE");
  });

  it("keeps a colon inside the value", () => {
    expect(parseContentLine("URL:https://hax.psu.edu/").value).to.equal(
      "https://hax.psu.edu/",
    );
  });

  it("drops a group prefix from the property name", () => {
    expect(parseContentLine("item1.TEL:555-0100").name).to.equal("TEL");
  });

  it("returns nothing for a line with no colon", () => {
    expect(parseContentLine("BEGIN")).to.equal(null);
  });

  it("unescapes text values", () => {
    expect(unescapeText("one\\ntwo")).to.equal("one\ntwo");
    expect(unescapeText("IST 402\\; Westgate")).to.equal("IST 402; Westgate");
    expect(unescapeText("Doe\\, John")).to.equal("Doe, John");
  });
});

describe("vcf-parse photo safety", () => {
  it("allows an http or https URL", () => {
    expect(safePhotoSource("http://example.com/a.png", {})).to.equal(
      "http://example.com/a.png",
    );
    expect(safePhotoSource("https://example.com/a.png", {})).to.equal(
      "https://example.com/a.png",
    );
  });

  it("allows an image data URI", () => {
    expect(safePhotoSource("data:image/png;base64,AAA", {})).to.equal(
      "data:image/png;base64,AAA",
    );
  });

  it("refuses a script URL", () => {
    expect(safePhotoSource("javascript:alert(1)", {})).to.equal("");
  });

  it("refuses a data URI that is not an image", () => {
    expect(safePhotoSource("data:text/html,<script>", {})).to.equal("");
  });

  it("builds a data URI from a base64 photo and its declared type", () => {
    expect(
      safePhotoSource("iVBORw0KGgo=", { ENCODING: "b", TYPE: "PNG" }),
    ).to.equal("data:image/png;base64,iVBORw0KGgo=");
  });

  it("normalises jpg to jpeg", () => {
    expect(
      safePhotoSource("iVBORw0KGgo=", { ENCODING: "b", TYPE: "JPG" }),
    ).to.equal("data:image/jpeg;base64,iVBORw0KGgo=");
  });

  it("refuses base64 with no declared image type", () => {
    expect(safePhotoSource("iVBORw0KGgo=", { ENCODING: "b" })).to.equal("");
  });

  it("refuses an empty value", () => {
    expect(safePhotoSource("", {})).to.equal("");
    expect(safePhotoSource(undefined, {})).to.equal("");
  });
});

describe("vcf-parse contacts", () => {
  it("reads the sample card", () => {
    const { contacts } = parseVcf(SAMPLE);
    expect(contacts.length).to.equal(1);
    const contact = contacts[0];
    expect(contact.displayName).to.equal("John Doe");
    expect(contact.name.family).to.equal("Doe");
    expect(contact.name.given).to.equal("John");
    expect(contact.tels.length).to.equal(3);
    expect(contact.emails.length).to.equal(2);
    expect(contact.address).to.equal(
      "42 Plantation St., Baytown, LA, 30314, United States of America",
    );
    expect(contact.url).to.equal("https://www.google.com/");
    expect(contact.photo).to.contain("upload.wikimedia.org");
  });

  it("keeps an embedded AGENT card inside its contact", () => {
    const { contacts } = parseVcf(SAMPLE);
    expect(contacts.length).to.equal(1);
    expect(contacts[0].hasAgent).to.equal(true);
  });

  it("prefers the email and phone marked PREF", () => {
    const { contacts } = parseVcf(SAMPLE);
    expect(contacts[0].email).to.equal("forrestgump@example.com");
    expect(contacts[0].tel).to.equal("(111) 555-1212");
  });

  it("reads a type repeated inside one parameter", () => {
    const { contacts } = parseVcf(SAMPLE);
    // TEL;TYPE=HOME,TYPE=VOICE: is two types, not a type called "type=voice"
    expect(contacts[0].tels[2].types).to.deep.equal(["home", "voice"]);
  });

  it("reads several cards in one file, in file order", () => {
    const text = [
      "BEGIN:VCARD",
      "FN:First Person",
      "END:VCARD",
      "BEGIN:VCARD",
      "FN:Second Person",
      "END:VCARD",
    ].join("\r\n");
    const { contacts } = parseVcf(text);
    expect(contacts.map((contact) => contact.displayName)).to.deep.equal([
      "First Person",
      "Second Person",
    ]);
  });

  it("splits a structured organisation and address", () => {
    const text = [
      "BEGIN:VCARD",
      "FN:Jane Smith",
      "ORG:Penn State;College of IST;Learning Design",
      "ADR;TYPE=WORK:;Suite 2;100 Innovation Blvd;State College;PA;16803;USA",
      "END:VCARD",
    ].join("\r\n");
    const { contacts } = parseVcf(text);
    expect(contacts[0].org).to.equal("Penn State");
    expect(contacts[0].orgUnits).to.deep.equal([
      "College of IST",
      "Learning Design",
    ]);
    expect(contacts[0].addresses[0].postalCode).to.equal("16803");
    expect(contacts[0].addresses[0].extended).to.equal("Suite 2");
    expect(contacts[0].address).to.equal(
      "100 Innovation Blvd, State College, PA, 16803, USA",
    );
  });

  it("assembles a display name when FN is missing", () => {
    const { contacts } = parseVcf(
      ["BEGIN:VCARD", "N:Smith;Jane;Q;;", "END:VCARD"].join("\r\n"),
    );
    expect(contacts[0].displayName).to.equal("Jane Q Smith");
  });

  it("falls back to the organisation, then to an email", () => {
    const byOrg = parseVcf(
      ["BEGIN:VCARD", "ORG:Acme Corp", "END:VCARD"].join("\r\n"),
    );
    expect(byOrg.contacts[0].displayName).to.equal("Acme Corp");
    const byEmail = parseVcf(
      ["BEGIN:VCARD", "EMAIL:someone@example.com", "END:VCARD"].join("\r\n"),
    );
    expect(byEmail.contacts[0].displayName).to.equal("someone@example.com");
  });

  it("uses TITLE for the position, then ROLE", () => {
    const titled = parseVcf(
      [
        "BEGIN:VCARD",
        "FN:A",
        "TITLE:Professor",
        "ROLE:Faculty",
        "END:VCARD",
      ].join("\r\n"),
    );
    expect(titled.contacts[0].position).to.equal("Professor");
    const roled = parseVcf(
      ["BEGIN:VCARD", "FN:B", "ROLE:Vendor", "END:VCARD"].join("\r\n"),
    );
    expect(roled.contacts[0].position).to.equal("Vendor");
  });

  it("uses the note as the quotable summary, then the role and organisation", () => {
    const noted = parseVcf(
      ["BEGIN:VCARD", "FN:A", "NOTE:Teaches the capstone.", "END:VCARD"].join(
        "\r\n",
      ),
    );
    expect(noted.contacts[0].summary).to.equal("Teaches the capstone.");
    const unnoted = parseVcf(
      [
        "BEGIN:VCARD",
        "FN:B",
        "TITLE:Director",
        "ORG:Example Corp",
        "END:VCARD",
      ].join("\r\n"),
    );
    expect(unnoted.contacts[0].summary).to.equal("Director, Example Corp");
  });

  it("reads categories and kind", () => {
    const { contacts } = parseVcf(
      [
        "BEGIN:VCARD",
        "FN:Acme Corp",
        "KIND:org",
        "CATEGORIES:Vendors,Approved",
        "END:VCARD",
      ].join("\r\n"),
    );
    expect(contacts[0].kind).to.equal("org");
    expect(contacts[0].categories).to.deep.equal(["Vendors", "Approved"]);
  });

  it("refuses a URL that is not http or https", () => {
    const { contacts } = parseVcf(
      ["BEGIN:VCARD", "FN:A", "URL:javascript:alert(1)", "END:VCARD"].join(
        "\r\n",
      ),
    );
    expect(contacts[0].urls).to.deep.equal([]);
    expect(contacts[0].url).to.equal("");
  });

  it("keeps a card the file never closed", () => {
    const text = [
      "BEGIN:VCARD",
      "FN:Closed Person",
      "END:VCARD",
      "BEGIN:VCARD",
      "FN:Unclosed Person",
    ].join("\r\n");
    const { contacts } = parseVcf(text);
    expect(contacts.map((contact) => contact.displayName)).to.deep.equal([
      "Closed Person",
      "Unclosed Person",
    ]);
  });

  it("does not count an empty card as a contact", () => {
    expect(
      parseVcf(["BEGIN:VCARD", "VERSION:3.0", "END:VCARD"].join("\r\n"))
        .contacts,
    ).to.deep.equal([]);
  });

  it("returns no contacts rather than throwing on junk", () => {
    [undefined, null, "", "not a card", "{}"].forEach((input) => {
      expect(parseVcf(input).contacts).to.deep.equal([]);
    });
  });
});
