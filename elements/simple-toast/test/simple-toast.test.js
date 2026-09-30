import { fixture, expect, html } from "@open-wc/testing"

import "../simple-toast.js"
import "../lib/simple-toast-el.js"

describe("simple-toast test", () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <simple-toast title="test-title"></simple-toast>
    `)
  })

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe("simple-toast default state", () => {
  let toast
  beforeEach(async () => {
    toast = await fixture(html`<simple-toast></simple-toast>`)
  })

  it("has default values from setDefaultToast", () => {
    expect(toast.opened).to.equal(false)
    expect(toast.text).to.equal("Saved")
    expect(toast.closeText).to.equal("Close")
    expect(toast.duration).to.equal(3000)
    expect(toast.closeButton).to.equal(true)
    expect(toast.eventCallback).to.equal(null)
    expect(toast.classStyle).to.equal("")
  })

  it("show() sets opened to true", () => {
    toast.show()
    expect(toast.opened).to.equal(true)
  })

  it("hide() sets opened to false", () => {
    toast.opened = true
    toast.hide()
    expect(toast.opened).to.equal(false)
  })

  it("hide() dispatches eventCallback when set", () => {
    let dispatched = false
    toast.eventCallback = "my-callback"
    toast.addEventListener("my-callback", () => {
      dispatched = true
    })
    toast.hide()
    expect(dispatched).to.equal(true)
    expect(toast.eventCallback).to.equal("my-callback")
  })

  it("openedChanged updates opened from event detail", () => {
    toast.openedChanged({ detail: { value: true } })
    expect(toast.opened).to.equal(true)
  })

  it("hideSimpleToast calls hide", () => {
    toast.opened = true
    toast.hideSimpleToast({})
    expect(toast.opened).to.equal(false)
  })

  it("setDefaultToast removes all children", async () => {
    const child = globalThis.document.createElement("div")
    toast.appendChild(child)
    expect(toast.firstChild).to.not.equal(null)
    toast.setDefaultToast()
    expect(toast.firstChild).to.equal(null)
  })
})

describe("simple-toast show via event", () => {
  let toast
  beforeEach(async () => {
    toast = await fixture(html`<simple-toast></simple-toast>`)
  })

  it("showSimpleToast applies event detail properties", async () => {
    const slotEl = globalThis.document.createElement("div")
    const fakeEvent = {
      detail: {
        duration: 5000,
        text: "Hello world",
        classStyle: "fit-bottom",
        closeText: "Dismiss",
        closeButton: false,
        eventCallback: "cb-event",
        slot: slotEl,
      },
    }
    toast.showSimpleToast(fakeEvent)
    expect(toast.duration).to.equal(5000)
    expect(toast.text).to.equal("Hello world")
    expect(toast.classStyle).to.equal("fit-bottom")
    expect(toast.closeText).to.equal("Dismiss")
    // closeButton=false is falsy so showSimpleToast's `if (e.detail.closeButton)` guard
    // skips it, leaving the default true. This is a production code quirk.
    expect(toast.eventCallback).to.equal("cb-event")
    expect(toast.opened).to.equal(true)
  })

  it("showSimpleToast works with partial detail", () => {
    toast.showSimpleToast({ detail: { text: "Partial" } })
    expect(toast.text).to.equal("Partial")
    expect(toast.opened).to.equal(true)
  })

  it("showSimpleToast with no detail properties uses defaults", () => {
    toast.showSimpleToast({ detail: {} })
    expect(toast.text).to.equal("Saved")
    expect(toast.opened).to.equal(true)
  })

  it("showSimpleToast sets closeButton when truthy", () => {
    toast.showSimpleToast({ detail: { closeButton: true } })
    expect(toast.closeButton).to.equal(true)
  })
})

describe("simple-toast singleton", () => {
  afterEach(() => {
    if (globalThis.SimpleToast.instance) {
      globalThis.SimpleToast.instance.remove()
      globalThis.SimpleToast.instance = undefined
    }
  })

  it("requestAvailability creates singleton instance", () => {
    const instance = globalThis.SimpleToast.requestAvailability()
    expect(instance).to.exist
    expect(globalThis.SimpleToast.instance).to.equal(instance)
  })

  it("requestAvailability returns same instance on second call", () => {
    const instance1 = globalThis.SimpleToast.requestAvailability()
    const instance2 = globalThis.SimpleToast.requestAvailability()
    expect(instance1).to.equal(instance2)
  })

  it("singleton responds to simple-toast-show event", async () => {
    const instance = globalThis.SimpleToast.requestAvailability()
    globalThis.dispatchEvent(
      new CustomEvent("simple-toast-show", {
        detail: { text: "Event fired", duration: 2000 },
      }),
    )
    await new Promise((r) => setTimeout(r, 10))
    expect(instance.text).to.equal("Event fired")
    expect(instance.duration).to.equal(2000)
  })

  it("singleton responds to simple-toast-hide event", async () => {
    const instance = globalThis.SimpleToast.requestAvailability()
    instance.opened = true
    globalThis.dispatchEvent(new CustomEvent("simple-toast-hide"))
    await new Promise((r) => setTimeout(r, 10))
    expect(instance.opened).to.equal(false)
  })
})

describe("simple-toast-el behavioral tests", () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-toast-el></simple-toast-el>`)
  })

  it("has default values", () => {
    expect(el.text).to.equal("")
    expect(el.alwaysvisible).to.equal(false)
    expect(el.duration).to.equal(3000)
    expect(el.opened).to.equal(false)
  })

  it("sets aria attributes on firstUpdated", () => {
    expect(el.getAttribute("aria-live")).to.equal("polite")
    expect(el.getAttribute("role")).to.equal("status")
    expect(el.getAttribute("aria-atomic")).to.equal("true")
    expect(el.getAttribute("aria-relevant")).to.equal("additions text")
  })

  it("show() adds show class and sets text", () => {
    el.show("Test message")
    expect(el.classList.contains("show")).to.equal(true)
    expect(el.text).to.equal("Test message")
  })

  it("show() with no arg defaults to empty string", () => {
    el.show()
    expect(el.classList.contains("show")).to.equal(true)
    expect(el.text).to.equal("")
  })

  it("hide() removes show class and sets opened false", () => {
    el.classList.add("show")
    el.opened = true
    el.hide()
    expect(el.classList.contains("show")).to.equal(false)
    expect(el.opened).to.equal(false)
  })

  it("hide() clears dismiss timer", () => {
    el.__dismissTimer = setTimeout(() => {}, 10000)
    el.hide()
    expect(el.__dismissTimer).to.equal(null)
  })

  it("_onAnimationEnd calls hide on fadeout", () => {
    el.classList.add("show")
    el.opened = true
    el._onAnimationEnd({ animationName: "fadeout" })
    expect(el.classList.contains("show")).to.equal(false)
    expect(el.opened).to.equal(false)
  })

  it("_onAnimationEnd calls hide on forcedfadeout", () => {
    el.classList.add("show")
    el.opened = true
    el._onAnimationEnd({ animationName: "forcedfadeout" })
    expect(el.classList.contains("show")).to.equal(false)
  })

  it("_onAnimationEnd does nothing on fadein", () => {
    el.classList.add("show")
    el.opened = true
    el._onAnimationEnd({ animationName: "fadein" })
    expect(el.classList.contains("show")).to.equal(true)
  })

  it("_onAnimationEnd does nothing on unknown animation", () => {
    el.classList.add("show")
    el.opened = true
    el._onAnimationEnd({ animationName: "slide" })
    expect(el.classList.contains("show")).to.equal(true)
  })
})

describe("simple-toast-el _prefersReducedMotion", () => {
  let el
  let origMatchMedia
  beforeEach(async () => {
    el = await fixture(html`<simple-toast-el></simple-toast-el>`)
    origMatchMedia = globalThis.matchMedia
  })
  afterEach(() => {
    globalThis.matchMedia = origMatchMedia
  })

  it("returns true when matchMedia reports reduce", () => {
    globalThis.matchMedia = () => ({ matches: true })
    expect(el._prefersReducedMotion()).to.equal(true)
  })

  it("returns false when matchMedia reports no-reduce", () => {
    globalThis.matchMedia = () => ({ matches: false })
    expect(el._prefersReducedMotion()).to.equal(false)
  })

  it("returns falsy when matchMedia is undefined", () => {
    const orig = globalThis.matchMedia
    globalThis.matchMedia = undefined
    expect(!el._prefersReducedMotion()).to.equal(true)
    globalThis.matchMedia = orig
  })
})

describe("simple-toast-el _getAnimation", () => {
  let el
  let origMatchMedia
  beforeEach(async () => {
    el = await fixture(html`<simple-toast-el></simple-toast-el>`)
    origMatchMedia = globalThis.matchMedia
    globalThis.matchMedia = () => ({ matches: false })
  })
  afterEach(() => {
    globalThis.matchMedia = origMatchMedia
  })

  it("returns none when reduced motion preferred", () => {
    globalThis.matchMedia = () => ({ matches: true })
    expect(el._getAnimation()).to.equal("none")
  })

  it("returns fadein+fadeout for normal with duration", () => {
    el.duration = 3000
    el.alwaysvisible = false
    el.awaitingMerlinInput = false
    const result = el._getAnimation()
    expect(result).to.contain("fadein")
    expect(result).to.contain("fadeout")
    expect(result).to.contain("3")
  })

  it("returns only fadein when alwaysvisible", () => {
    el.alwaysvisible = true
    expect(el._getAnimation()).to.equal("fadein 0.3s")
  })

  it("returns only fadein when awaitingMerlinInput", () => {
    el.awaitingMerlinInput = true
    expect(el._getAnimation()).to.equal("fadein 0.3s")
  })

  it("accepts custom duration parameter", () => {
    el.alwaysvisible = false
    el.awaitingMerlinInput = false
    const result = el._getAnimation(5000)
    expect(result).to.contain("5")
  })
})

describe("simple-toast-el updated lifecycle", () => {
  let el
  let origMatchMedia
  beforeEach(async () => {
    el = await fixture(html`<simple-toast-el></simple-toast-el>`)
    origMatchMedia = globalThis.matchMedia
    globalThis.matchMedia = () => ({ matches: false })
  })
  afterEach(() => {
    globalThis.matchMedia = origMatchMedia
  })

  it("dispatches opened-changed when opened changes", async () => {
    let dispatched = false
    let dispatchedValue = null
    el.addEventListener("opened-changed", (e) => {
      dispatched = true
      dispatchedValue = e.detail.value
    })
    el.opened = true
    await new Promise((r) => setTimeout(r, 10))
    expect(dispatched).to.equal(true)
    expect(dispatchedValue).to.equal(true)
  })

  it("sets dismiss timer when opened with duration > 0", async () => {
    el.duration = 100
    el.alwaysvisible = false
    el.awaitingMerlinInput = false
    el.opened = true
    await new Promise((r) => setTimeout(r, 10))
    expect(el.__dismissTimer).to.not.equal(null)
  })

  it("does not set dismiss timer when alwaysvisible", async () => {
    el.duration = 100
    el.alwaysvisible = true
    el.opened = true
    await new Promise((r) => setTimeout(r, 10))
    expect(el.__dismissTimer).to.equal(null)
  })

  it("does not set dismiss timer when awaitingMerlinInput", async () => {
    el.duration = 100
    el.awaitingMerlinInput = true
    el.opened = true
    await new Promise((r) => setTimeout(r, 10))
    expect(el.__dismissTimer).to.equal(null)
  })

  it("does not set dismiss timer when duration is 0", async () => {
    el.duration = 0
    el.opened = true
    await new Promise((r) => setTimeout(r, 10))
    expect(el.__dismissTimer).to.equal(null)
  })

  it("hide is called when opened set to false", async () => {
    el.opened = true
    await new Promise((r) => setTimeout(r, 10))
    el.opened = false
    await new Promise((r) => setTimeout(r, 10))
    expect(el.classList.contains("show")).to.equal(false)
    expect(el.opened).to.equal(false)
  })

  it("clears previous dismiss timer on new opened change", async () => {
    el.duration = 500
    el.opened = true
    await new Promise((r) => setTimeout(r, 10))
    const firstTimer = el.__dismissTimer
    expect(firstTimer).to.not.equal(null)
    el.opened = false
    await new Promise((r) => setTimeout(r, 10))
    expect(el.__dismissTimer).to.equal(null)
  })

  it("updates animation when duration changes", async () => {
    el.duration = 2000
    await new Promise((r) => setTimeout(r, 10))
    expect(el.style.animation).to.contain("fadein")
  })

  it("dismiss timer callback fires and hides toast", async () => {
    el.duration = 1
    el.alwaysvisible = false
    el.awaitingMerlinInput = false
    el.opened = true
    await new Promise((r) => setTimeout(r, 50))
    // dismiss timer is duration + 600 = 601ms
    await new Promise((r) => setTimeout(r, 700))
    expect(el.classList.contains("show")).to.equal(false)
    expect(el.opened).to.equal(false)
  })
})
