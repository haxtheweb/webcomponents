import { fixture, expect, html } from '@open-wc/testing'

// Explicit imports so istanbul instruments each lib file
import '../lib/simple-clipboard-copy-button.js'
import '../lib/simple-icon-button-lite.js'
import { SimpleClipboardCopyButton } from '../lib/simple-clipboard-copy-button.js'
import { SimpleIconButtonLite } from '../lib/simple-icon-button-lite.js'

// stub/restore pattern for global singletons (see hax-body store tests)
function stubClipboard(writeTextImpl) {
  const orig = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    'clipboard',
  )
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    value: { writeText: writeTextImpl },
    configurable: true,
  })
  return () => {
    if (orig) {
      Object.defineProperty(globalThis.navigator, 'clipboard', orig)
    } else {
      delete globalThis.navigator.clipboard
    }
  }
}

function stubExecCommand(impl) {
  const hadOwn = Object.prototype.hasOwnProperty.call(
    globalThis.document,
    'execCommand',
  )
  const orig = globalThis.document.execCommand
  globalThis.document.execCommand = impl
  return () => {
    if (hadOwn) {
      globalThis.document.execCommand = orig
    } else {
      delete globalThis.document.execCommand
    }
  }
}

async function settle() {
  await new Promise((r) => setTimeout(r, 0))
  await new Promise((r) => setTimeout(r, 0))
}

function trackEvents(el) {
  const seen = []
  const names = [
    'simple-clipboard-copy',
    'simple-clipboard-copy-success',
    'simple-clipboard-copy-error',
  ]
  names.forEach((name) => {
    el.addEventListener(name, (e) => {
      seen.push({ name, detail: e.detail })
    })
  })
  return seen
}

describe('simple-clipboard-copy-button', () => {
  it('has the correct tag name', () => {
    expect(SimpleClipboardCopyButton.tag).to.equal(
      'simple-clipboard-copy-button',
    )
  })

  it('instantiates as a SimpleIconButtonLite subclass', async () => {
    const el = await fixture(
      html`<simple-clipboard-copy-button></simple-clipboard-copy-button>`,
    )
    expect(el instanceof SimpleClipboardCopyButton).to.be.true
    expect(el instanceof SimpleIconButtonLite).to.be.true
  })

  it('defaults dataCp, icon, label, and messages', async () => {
    const el = await fixture(
      html`<simple-clipboard-copy-button></simple-clipboard-copy-button>`,
    )
    expect(el.dataCp).to.equal('')
    expect(el.icon).to.equal('content-copy')
    expect(el.label).to.equal('Copy to clipboard')
    expect(el.successMessage).to.equal('')
    expect(el.errorMessage).to.equal('')
  })

  it('declares data-cp, success-message, and error-message attributes', () => {
    const props = SimpleClipboardCopyButton.properties
    expect(props.dataCp.attribute).to.equal('data-cp')
    expect(props.successMessage.attribute).to.equal('success-message')
    expect(props.errorMessage.attribute).to.equal('error-message')
  })

  it('renders a labeled button with a content-copy icon', async () => {
    const el = await fixture(
      html`<simple-clipboard-copy-button></simple-clipboard-copy-button>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(!!btn).to.be.true
    expect(btn.getAttribute('aria-label')).to.equal('Copy to clipboard')
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon.getAttribute('icon')).to.equal('content-copy')
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<simple-clipboard-copy-button></simple-clipboard-copy-button>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })

  it('_getCopyValue trims the dataCp property', async () => {
    const el = await fixture(
      html`<simple-clipboard-copy-button></simple-clipboard-copy-button>`,
    )
    el.dataCp = '  hello world  '
    expect(el._getCopyValue()).to.equal('hello world')
  })

  it('_getCopyValue falls back to the data-cp attribute', async () => {
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="attr-value"></simple-clipboard-copy-button>`,
    )
    // empty the property so the attribute fallback kicks in
    el.dataCp = ''
    expect(el._getCopyValue()).to.equal('attr-value')
  })

  it('_getCopyValue returns empty string without any value', async () => {
    const el = await fixture(
      html`<simple-clipboard-copy-button></simple-clipboard-copy-button>`,
    )
    expect(el._getCopyValue()).to.equal('')
  })

  it('clicking copies the value and fires success events', async () => {
    let written = null
    const restore = stubClipboard(async (text) => {
      written = text
    })
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="hello world"></simple-clipboard-copy-button>`,
    )
    const seen = trackEvents(el)
    el.click()
    await settle()
    expect(written).to.equal('hello world')
    const copy = seen.find((e) => e.name === 'simple-clipboard-copy')
    expect(!!copy).to.be.true
    expect(copy.detail.value).to.equal('hello world')
    expect(copy.detail.copied).to.be.true
    expect(
      seen.some((e) => e.name === 'simple-clipboard-copy-success'),
    ).to.be.true
    expect(
      seen.some((e) => e.name === 'simple-clipboard-copy-error'),
    ).to.be.false
    restore()
  })

  it('fires simple-toast-show with the default success message', async () => {
    const toasts = []
    const handler = (e) => toasts.push(e.detail)
    globalThis.addEventListener('simple-toast-show', handler)
    const restore = stubClipboard(async () => {})
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="x"></simple-clipboard-copy-button>`,
    )
    el.click()
    await settle()
    globalThis.removeEventListener('simple-toast-show', handler)
    restore()
    expect(toasts.length).to.equal(1)
    expect(toasts[0].text).to.equal('Copied to clipboard')
    expect(toasts[0].duration).to.equal(3000)
  })

  it('fires simple-toast-show with a custom success message', async () => {
    const toasts = []
    const handler = (e) => toasts.push(e.detail)
    globalThis.addEventListener('simple-toast-show', handler)
    const restore = stubClipboard(async () => {})
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="x" success-message="Yay copied"></simple-clipboard-copy-button>`,
    )
    el.click()
    await settle()
    globalThis.removeEventListener('simple-toast-show', handler)
    restore()
    expect(toasts.length).to.equal(1)
    expect(toasts[0].text).to.equal('Yay copied')
  })

  it('fires haxcms-toast-show when HAXCMSToast is available', async () => {
    globalThis.HAXCMSToast = { available: true }
    const toasts = []
    const handler = (e) => toasts.push({ name: e.type, text: e.detail.text })
    globalThis.addEventListener('haxcms-toast-show', handler)
    const restore = stubClipboard(async () => {})
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="x"></simple-clipboard-copy-button>`,
    )
    el.click()
    await settle()
    globalThis.removeEventListener('haxcms-toast-show', handler)
    delete globalThis.HAXCMSToast
    restore()
    expect(toasts.length).to.equal(1)
    expect(toasts[0].name).to.equal('haxcms-toast-show')
    expect(toasts[0].text).to.equal('Copied to clipboard')
  })

  it('fires the error event and toast when the clipboard fails', async () => {
    const toasts = []
    const toastHandler = (e) => toasts.push(e.detail)
    globalThis.addEventListener('simple-toast-show', toastHandler)
    const restoreClipboard = stubClipboard(async () => {
      throw new Error('denied')
    })
    const restoreExec = stubExecCommand(() => false)
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="nope"></simple-clipboard-copy-button>`,
    )
    const seen = trackEvents(el)
    el.click()
    await settle()
    globalThis.removeEventListener('simple-toast-show', toastHandler)
    restoreExec()
    restoreClipboard()
    const copy = seen.find((e) => e.name === 'simple-clipboard-copy')
    expect(!!copy).to.be.true
    expect(copy.detail.copied).to.be.false
    expect(
      seen.some((e) => e.name === 'simple-clipboard-copy-error'),
    ).to.be.true
    expect(
      seen.some((e) => e.name === 'simple-clipboard-copy-success'),
    ).to.be.false
    expect(toasts.length).to.equal(1)
    expect(toasts[0].text).to.equal('Unable to copy to clipboard')
  })

  it('fires the error toast with a custom error message', async () => {
    const toasts = []
    const toastHandler = (e) => toasts.push(e.detail)
    globalThis.addEventListener('simple-toast-show', toastHandler)
    const restoreClipboard = stubClipboard(async () => {
      throw new Error('denied')
    })
    const restoreExec = stubExecCommand(() => false)
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="nope" error-message="Oops"></simple-clipboard-copy-button>`,
    )
    el.click()
    await settle()
    globalThis.removeEventListener('simple-toast-show', toastHandler)
    restoreExec()
    restoreClipboard()
    expect(toasts.length).to.equal(1)
    expect(toasts[0].text).to.equal('Oops')
  })

  it('falls back to the legacy execCommand path on success', async () => {
    // no async clipboard API available
    const restoreClipboard = stubClipboard(undefined)
    const restoreExec = stubExecCommand(() => true)
    const toasts = []
    const toastHandler = (e) => toasts.push(e.detail)
    globalThis.addEventListener('simple-toast-show', toastHandler)
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="legacy"></simple-clipboard-copy-button>`,
    )
    const seen = trackEvents(el)
    el.click()
    await settle()
    globalThis.removeEventListener('simple-toast-show', toastHandler)
    restoreExec()
    // put a working clipboard back for other tests
    restoreClipboard()
    const copy = seen.find((e) => e.name === 'simple-clipboard-copy')
    expect(!!copy).to.be.true
    expect(copy.detail.copied).to.be.true
    expect(
      seen.some((e) => e.name === 'simple-clipboard-copy-success'),
    ).to.be.true
    expect(toasts.length).to.equal(1)
    expect(toasts[0].text).to.equal('Copied to clipboard')
  })

  it('does nothing when disabled', async () => {
    const restore = stubClipboard(async () => {})
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="x" disabled></simple-clipboard-copy-button>`,
    )
    const seen = trackEvents(el)
    el.click()
    await settle()
    restore()
    expect(seen.length).to.equal(0)
  })

  it('does nothing without a value', async () => {
    const restore = stubClipboard(async () => {})
    const el = await fixture(
      html`<simple-clipboard-copy-button></simple-clipboard-copy-button>`,
    )
    const seen = trackEvents(el)
    el.click()
    await settle()
    restore()
    expect(seen.length).to.equal(0)
  })

  it('removes the click listener when disconnected', async () => {
    const restore = stubClipboard(async () => {})
    const el = await fixture(
      html`<simple-clipboard-copy-button data-cp="x"></simple-clipboard-copy-button>`,
    )
    const seen = trackEvents(el)
    el.remove()
    el.click()
    await settle()
    restore()
    expect(seen.length).to.equal(0)
  })
})
