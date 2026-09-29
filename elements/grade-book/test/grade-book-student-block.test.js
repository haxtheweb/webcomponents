import { fixture, expect, html } from "@open-wc/testing";
import "@haxtheweb/grid-plate/grid-plate.js";
import "../lib/grade-book-student-block.js";
import { GradeBookStudentBlock } from "../lib/grade-book-student-block.js";
import { flush } from "./fixtures.js";

const fullStudent = () => ({
  name: "Alice Alvarez",
  prefName: "Alice",
  userId: "abc123",
  email: "alice@example.com",
  photo: "https://example.com/alice.jpg",
  notes: "great with typography",
  interests: ["art", "code"],
});

describe("grade-book-student-block", () => {
  it("has the expected tag and defaults", () => {
    expect(GradeBookStudentBlock.tag).to.equal("grade-book-student-block");
    const el = globalThis.document.createElement("grade-book-student-block");
    expect(typeof el.student).to.equal("object");
  });

  it("renders photo, name, id, preferred name, email, notes and interests", async () => {
    const el = await fixture(
      html`<grade-book-student-block
        .student=${fullStudent()}
      ></grade-book-student-block>`,
    );
    await flush();
    const img = el.shadowRoot.querySelector("img");
    expect(img).to.exist;
    expect(img.getAttribute("src")).to.equal("https://example.com/alice.jpg");
    expect(el.shadowRoot.innerHTML.includes("Alice Alvarez")).to.equal(true);
    expect(el.shadowRoot.innerHTML.includes("abc123")).to.equal(true);
    expect(el.shadowRoot.innerHTML.includes("Alice")).to.equal(true);
    const mail = el.shadowRoot.querySelector('a[href="mailto:alice@example.com"]');
    expect(mail).to.exist;
    expect(el.shadowRoot.innerHTML.includes("great with typography")).to.equal(
      true,
    );
    expect(el.shadowRoot.innerHTML.includes("art,code")).to.equal(true);
  });

  it("falls back to an account icon when no photo exists", async () => {
    const student = fullStudent();
    student.photo = "";
    const el = await fixture(
      html`<grade-book-student-block
        .student=${student}
      ></grade-book-student-block>`,
    );
    await flush();
    expect(el.shadowRoot.querySelector("img")).to.equal(null);
    const icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon).to.exist;
    expect(icon.getAttribute("icon")).to.equal("account-circle");
  });

  it("omits detail list items that are not present", async () => {
    const el = await fixture(
      html`<grade-book-student-block
        .student=${{ name: "Bobby" }}
      ></grade-book-student-block>`,
    );
    await flush();
    expect(el.shadowRoot.innerHTML.includes("Bobby")).to.equal(true);
    expect(el.shadowRoot.querySelector("img")).to.equal(null);
    expect(el.shadowRoot.querySelector("a")).to.equal(null);
    expect(el.shadowRoot.querySelectorAll("li").length).to.equal(0);
  });

  it("renders an alt missing its prefix because t.photoOf is never defined (BUG)", async () => {
    // BUG grade-book-student-block.js:57 the img alt is built from
    // this.t.photoOf but that key does not exist in the element's t object
    // (profileImageFor is the defined-but-unused key). Lit drops undefined
    // interpolations so the alt renders as just " Alice" with a leading
    // space and no descriptive prefix
    const student = fullStudent();
    const el = await fixture(
      html`<grade-book-student-block
        .student=${student}
      ></grade-book-student-block>`,
    );
    await flush();
    const alt = el.shadowRoot.querySelector("img").getAttribute("alt");
    expect(alt.trim()).to.equal("Alice");
    expect(alt.indexOf("Profile")).to.equal(-1);
  });
});
