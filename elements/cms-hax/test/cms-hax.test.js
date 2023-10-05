import { fixture, expect, html } from "@open-wc/testing";

import "../cms-hax.js";

describe("cms-hax test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<cms-hax
      element-align="left"
      end-point="/dmd100/hax-node-save/1848/VXfGSpbA2T_bCl31L3E5k8YDlnqf30fvTUu2cP5Y-n8"
      app-store-connection='{"url":"${new URL(
        "../demo/sample-store.json",
        import.meta.url
      ).href}"}'
      redirect-location="/dmd100/node/1848"
      ><template
        ><p>
          Feedback can come in various forms, including advice, compliments,
          ambiguous remarks, big picture insights, etc. Learn how to listen
          carefully and diligently to what is being said so you can translate
          the feedback to be understandable, useful, and ultimately actionable.
          If someone gives you ambiguous feedback, this means that they can
          intuitively see a weakness but might not know why something isn't
          working. You should follow up with their comments with probing
          questions to better understand their perspective.
        </p>
        <p>
          If an instructor gives you advice and that they want you to do
          something, you should try it and see if it works. If it doesn't work
          well, then bring that up in the next critique. The instructor is not
          responsible for the choices you make when creating work, only for
          guiding and responding to those choices. If you make work that is
          sub-par as a result of the instructor asking you to try something,
          don't blame the instructor. You should have the ability to identify
          emergent weaknesses that the instructor did not anticipate, and pivot
          before showing that work in the next critique.
        </p>
        <h3>Interpreting feedback</h3>
        <p>
          Let's say you just pulled an all-nighter to get a project finished
          (unfortunately very common for art and design students). It's a
          masterpiece, and you can't wait to unveil it to unfettered acclaim
          from your peers. However, you show your work to everyone, and the
          response you get does not sound like praise. In fact, they say things
          like "it's not working" or "I don't understand why you did that ..."
          and you are devastated.
        </p>
        <p>
          Unless you had brutally honest parents growing up, you might not be
          used to a negative response to your creative work, particularly work
          in which you have invested considerable effort. Letting go of
          emotional attachment to your work will greatly help you with the
          ability to self-evaluate more objectively. That "eye" that people
          mention that perhaps got you into the field in the first place comes
          from this ability to objectively evaluate. Praise can certainly happen
          in feedback or critique and is a great way to communicate when you've
          done something well, but you should remain skeptical of too much
          praise. Unwarranted praise can really hold your work back, blinding
          you from where your weaknesses lie. If your work needs improvement,
          you need to know about it in order to improve, and this is the main
          goal of feedback.
        </p>
        <p>
          Though feedback typically centers on your work, sometimes comments are
          aimed at you and not your work. The emotional trauma of being
          criticized can be painful. Step back and remind yourself that the
          purpose of the feedback is to help and encourage you, not to be
          condescending or cruel. This objectivity is really important so that
          you can learn from the feedback. Some students have trouble trying
          anything outside of their comfort zone. This is often obvious in a
          feedback session or critique. Signs include defensiveness to negative
          feedback, sense of arrogance or overconfidence, dismissal of
          instructor comments or suggestions, and outright refusal to make
          changes according to feedback. This is not a professional attitude or
          outlook, and will keep you from the opportunities that will grow you
          as an artist or designer. Failure must happen rapidly so you can
          improve at a quick pace. Closed-mindedness causes failure to happen
          slowly over a long period of time. Your instructors are genuinely
          invested in your success and it is their job to point out
          shortcomings. Most student interpretations of overt "insensitivity" or
          "hardness" by an instructor typically results from a situation such as
          the one described.
        </p>
        <h3>Giving feedback</h3>
        <p>
          Keep it positive. A tried and true technique for feedback, where
          appropriate, is called the "critique sandwich." This is the Happy Meal
          of the critique process. Essentially, you will start and end a
          critique with positive comments (the bread), using the comments in
          between (the meat or meat-flavored tofu) for the important, possibly
          negative-sounding feedback. This makes hard-to-swallow comments more
          palatable, yet still communicates the important issues.
        </p>
        <h3>Trolling</h3>
        <meme-maker
          bottom-text="Trolling be"
          image-url="https://courses.elmsln-dev.vmhost.psu.edu/dmd100/sites/courses/aa/dmd100/files/headshot40581.19999998598.jpg"
          imageurl="https://courses.elmsln-dev.vmhost.psu.edu/dmd100/sites/courses/aa/dmd100/files/headshot40581.19999998598.jpg"
          style="width: 50%;"
          top-text="I can haz"
        ></meme-maker>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p>
          Anyone can intentionally or unintentionally become a troll. A troll is
          a person who is intent on disrupting constructive discussion by
          posting inflammatory remarks to halt the progress of a discussion —
          typically for the purpose of self-amusement or for the emotional high
          of winning an argument. This happens in online (and sometimes offline)
          spaces that lack established social norms or policy enforcement.
        </p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p>
          In an academic setting, the instructor sets the social norms of the
          classroom and maintains authority over moderating a discussion. It is
          not an instructor's job to be "thought police." Therefore, if a
          student has an opinion that is counter to the general opinions of the
          class, voicing those opinions are encouraged to provoke thoughtful
          discussion. However, disrespectful remarks meant to oppress another
          student will be considered trolling behavior and will not be allowed
          to continue without consequence.
        </p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p>
          Trolling is the antithetical to meaningful discussion and learning, so
          try to be mindful that your remarks (possibly being written under some
          emotional stress) don't accidentally veer off course and shut down a
          potentially helpful conversation.
        </p>
        <p></p>
        <p></p>
        <p></p>
        <p></p> </template
    ></cms-hax>`);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("cms-hax passes accessibility test", async () => {
    const el = await fixture(html` <cms-hax></cms-hax> `);
    await expect(el).to.be.accessible();
  });
  it("cms-hax passes accessibility negation", async () => {
    const el = await fixture(
      html`<cms-hax aria-labelledby="cms-hax"></cms-hax>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("cms-hax can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<cms-hax .foo=${'bar'}></cms-hax>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<cms-hax ></cms-hax>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<cms-hax></cms-hax>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<cms-hax></cms-hax>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
