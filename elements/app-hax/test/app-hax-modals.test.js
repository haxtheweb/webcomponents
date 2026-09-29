import { fixture, expect, html } from '@open-wc/testing'

globalThis.appSettings = {}

const { store } = await import('../lib/v2/AppHaxStore.js')
const { AppHaxConfirmationModal } = await import('../lib/v2/app-hax-confirmation-modal.js')
await import('../lib/v2/app-hax-site-login.js')

// Helper: create an unconnected confirmation modal with a mock shadowRoot
// to avoid simple-modal rendering errors in the test environment.
function createModal() {
  const el = new AppHaxConfirmationModal()
  Object.defineProperty(el, 'shadowRoot', {
    value: { querySelector: () => null },
    configurable: true,
  })
  return el
}

describe('app-hax-confirmation-modal', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('has correct tag name', () => {
    const el = document.createElement('app-hax-confirmation-modal')
    expect(el.constructor.tag).to.equal('app-hax-confirmation-modal')
  })

  it('initializes with default properties', () => {
    const el = document.createElement('app-hax-confirmation-modal')
    expect(el.open).to.be.false
    expect(el.title).to.equal('')
    expect(el.message).to.equal('')
    expect(el.confirmText).to.equal('Confirm')
    expect(el.cancelText).to.equal('Cancel')
    expect(el.dangerous).to.be.false
    expect(el.cancelIsNeutral).to.be.false
    expect(el.cancelActionOnPassiveClose).to.be.true
  })

  it('sets title and message properties', () => {
    const el = createModal()
    el.title = 'Confirm Action'
    el.message = 'Are you sure?'
    expect(el.title).to.equal('Confirm Action')
    expect(el.message).to.equal('Are you sure?')
  })

  it('sets custom confirm and cancel text', () => {
    const el = createModal()
    el.confirmText = 'Yes'
    el.cancelText = 'No'
    expect(el.confirmText).to.equal('Yes')
    expect(el.cancelText).to.equal('No')
  })

  it('openModal sets open to true and hides body overflow', () => {
    const el = createModal()
    el.openModal()
    expect(el.open).to.be.true
    expect(el._confirmed).to.be.false
    expect(el._cancelClicked).to.be.false
    expect(document.body.style.overflow).to.equal('hidden')
  })

  it('closeModal sets _cancelClicked', () => {
    const el = createModal()
    el.openModal()
    el.closeModal()
    expect(el._cancelClicked).to.be.true
  })

  it('confirmModal sets _confirmed and plays success sound', () => {
    const el = createModal()
    let soundPlayed = null
    store.appEl = {
      playSound: (s) => {
        soundPlayed = s
      },
    }
    el.confirmModal()
    expect(el._confirmed).to.be.true
    expect(soundPlayed).to.equal('success')
    store.appEl = null
  })

  it('confirmModal calls confirmAction when defined', () => {
    const el = createModal()
    let actionCalled = false
    el.confirmAction = () => {
      actionCalled = true
    }
    el.confirmModal()
    expect(actionCalled).to.be.true
  })

  it('handleModalClosed restores body overflow and dispatches close event', () => {
    const el = createModal()
    document.body.style.overflow = 'hidden'
    let closeFired = false
    el.addEventListener('close', () => {
      closeFired = true
    })
    el.handleModalClosed()
    expect(document.body.style.overflow).to.equal('')
    expect(el.open).to.be.false
    expect(closeFired).to.be.true
  })

  it('handleModalClosed fires cancelAction when not confirmed and passive close allowed', () => {
    const el = createModal()
    let cancelCalled = false
    el.cancelAction = () => {
      cancelCalled = true
    }
    el._confirmed = false
    el.cancelActionOnPassiveClose = true
    el.handleModalClosed()
    expect(cancelCalled).to.be.true
  })

  it('handleModalClosed does not fire cancelAction when confirmed', () => {
    const el = createModal()
    let cancelCalled = false
    el.cancelAction = () => {
      cancelCalled = true
    }
    el._confirmed = true
    el.handleModalClosed()
    expect(cancelCalled).to.be.false
  })

  it('handleModalClosed does not fire cancelAction when passive close disabled', () => {
    const el = createModal()
    let cancelCalled = false
    el.cancelAction = () => {
      cancelCalled = true
    }
    el._cancelClicked = false
    el.cancelActionOnPassiveClose = false
    el.handleModalClosed()
    expect(cancelCalled).to.be.false
  })

  it('handleModalClosed fires cancelAction when _cancelClicked is true', () => {
    const el = createModal()
    let cancelCalled = false
    el.cancelAction = () => {
      cancelCalled = true
    }
    el._confirmed = false
    el._cancelClicked = true
    el.cancelActionOnPassiveClose = false
    el.handleModalClosed()
    expect(cancelCalled).to.be.true
  })

  it('handleModalClosed plays error sound when not neutral and not confirmed', () => {
    const el = createModal()
    let soundPlayed = null
    store.appEl = {
      playSound: (s) => {
        soundPlayed = s
      },
    }
    el._confirmed = false
    el.cancelIsNeutral = false
    el.cancelActionOnPassiveClose = true
    el.handleModalClosed()
    expect(soundPlayed).to.equal('error')
    store.appEl = null
  })

  it('handleModalClosed does not play error sound when cancelIsNeutral', () => {
    const el = createModal()
    let soundPlayed = null
    store.appEl = {
      playSound: (s) => {
        soundPlayed = s
      },
    }
    el._confirmed = false
    el.cancelIsNeutral = true
    el.cancelActionOnPassiveClose = true
    el.handleModalClosed()
    expect(soundPlayed).to.be.null
    store.appEl = null
  })

  it('focusInitial delegates to focusCancelButton', () => {
    const el = createModal()
    let focused = false
    el.focusCancelButton = () => {
      focused = true
    }
    el.focusInitial()
    expect(focused).to.be.true
  })

  it('focusCancelButton does not throw when button missing', () => {
    const el = createModal()
    expect(() => el.focusCancelButton()).to.not.throw()
  })

  it('dangerous property can be set', () => {
    const el = createModal()
    el.dangerous = true
    expect(el.dangerous).to.be.true
  })
})

describe('app-hax-site-login', () => {
  it('has correct tag name', () => {
    const el = document.createElement('app-hax-site-login')
    expect(el.constructor.tag).to.equal('app-hax-site-login')
  })

  it('initializes with default properties', () => {
    const el = document.createElement('app-hax-site-login')
    expect(el.username).to.equal('')
    expect(el.password).to.equal('')
    expect(el.errorMSG).to.equal('Enter User name')
    expect(el.hidePassword).to.be.true
    expect(el.hasPass).to.be.false
  })

  it('renders username input when hidePassword is true', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    const usernameInput = el.shadowRoot.querySelector('#username')
    expect(usernameInput).to.exist
    expect(usernameInput.getAttribute('aria-label')).to.equal('Username')
  })

  it('renders password input when hidePassword is false', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    el.hidePassword = false
    el.username = 'testuser'
    await el.updateComplete
    const passwordInput = el.shadowRoot.querySelector('#password')
    expect(passwordInput).to.exist
    expect(passwordInput.getAttribute('aria-label')).to.equal('Password')
  })

  it('renders rpg-character with username seed', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    el.username = 'myuser'
    await el.updateComplete
    const rpg = el.shadowRoot.querySelector('rpg-character')
    expect(rpg).to.exist
    expect(rpg.getAttribute('seed')).to.equal('myuser')
  })

  it('reset clears state', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    el.username = 'testuser'
    el.errorMSG = 'some error'
    el.hasPass = true
    el.hidePassword = false
    el.reset()
    expect(el.errorMSG).to.equal('')
    expect(el.username).to.equal('')
    expect(el.hasPass).to.be.false
    expect(el.hidePassword).to.be.true
  })

  it('nameChange updates username from input', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    const input = el.shadowRoot.querySelector('#username')
    input.value = 'typed-name'
    el.nameChange()
    expect(el.username).to.equal('typed-name')
  })

  it('passChange sets hasPass true when password has value', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    el.hidePassword = false
    el.username = 'test'
    await el.updateComplete
    const input = el.shadowRoot.querySelector('#password')
    input.value = 'secret'
    el.passChange()
    expect(el.hasPass).to.be.true
  })

  it('passChange sets hasPass false when password empty', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    el.hidePassword = false
    el.username = 'test'
    el.hasPass = true
    await el.updateComplete
    const input = el.shadowRoot.querySelector('#password')
    input.value = ''
    el.passChange()
    expect(el.hasPass).to.be.false
  })

  it('toggleViewPass toggles password visibility', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    el.hidePassword = false
    el.username = 'test'
    await el.updateComplete
    const password = el.shadowRoot.querySelector('#password')
    password.setAttribute('type', 'password')
    el.toggleViewPass({ target: { icon: '' } })
    expect(password.getAttribute('type')).to.equal('text')
    el.toggleViewPass({ target: { icon: '' } })
    expect(password.getAttribute('type')).to.equal('password')
  })

  it('checkUsername sets hidePassword false and updates username', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    store.appEl = {
      playSound: () => {},
    }
    const input = el.shadowRoot.querySelector('#username')
    input.value = 'loginuser'
    el.checkUsername()
    expect(el.hidePassword).to.be.false
    expect(el.errorMSG).to.equal('')
    expect(el.username).to.equal('loginuser')
    store.appEl = null
  })

  it('checkPassword dispatches jwt-login-login event', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    store.appEl = {
      playSound: () => {},
    }
    el.username = 'testuser'
    el.hidePassword = false
    await el.updateComplete
    const input = el.shadowRoot.querySelector('#password')
    input.value = 'mypass'
    let capturedEvent = null
    globalThis.addEventListener('jwt-login-login', (e) => {
      capturedEvent = e
    })
    await el.checkPassword()
    globalThis.removeEventListener('jwt-login-login', () => {})
    expect(capturedEvent).to.exist
    expect(capturedEvent.detail.username).to.equal('testuser')
    expect(capturedEvent.detail.password).to.equal('mypass')
    store.appEl = null
  })

  it('_jwtLoginFailed sets error message and plays error sound', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    let soundPlayed = null
    store.appEl = {
      playSound: (s) => {
        soundPlayed = s
      },
    }
    el._jwtLoginFailed({})
    expect(el.hidePassword).to.be.true
    expect(el.errorMSG).to.equal('Invalid Username or Password')
    expect(soundPlayed).to.equal('error')
    store.appEl = null
  })

  it('_jwtLoggedIn sets user and plays success when detail is truthy', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    let soundPlayed = null
    store.appEl = {
      playSound: (s) => {
        soundPlayed = s
      },
      reset: () => {},
    }
    el.username = 'myuser'
    let toastFired = false
    const origToast = store.toast
    store.toast = () => {
      toastFired = true
    }
    el._jwtLoggedIn({ detail: true })
    expect(store.user.name).to.equal('myuser')
    expect(soundPlayed).to.equal('success')
    expect(toastFired).to.be.true
    store.toast = origToast
    store.appEl = null
  })

  it('_jwtLoggedIn does nothing when detail is falsy', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    const originalUser = store.user
    el._jwtLoggedIn({ detail: false })
    expect(store.user).to.equal(originalUser)
  })

  it('handleKeyDown calls checkUsername on Enter when hidePassword', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    store.appEl = { playSound: () => {} }
    let called = false
    const orig = el.checkUsername
    el.checkUsername = () => {
      called = true
    }
    el.handleKeyDown({ key: 'Enter' })
    expect(called).to.be.true
    el.checkUsername = orig
    store.appEl = null
  })

  it('handleKeyDown calls checkPassword on Enter when not hidePassword', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    el.hidePassword = false
    let called = false
    const orig = el.checkPassword
    el.checkPassword = () => {
      called = true
    }
    el.handleKeyDown({ key: 'Enter' })
    expect(called).to.be.true
    el.checkPassword = orig
  })

  it('handleKeyDown does nothing on non-Enter key', async () => {
    const el = await fixture(html`<app-hax-site-login></app-hax-site-login>`)
    await el.updateComplete
    let called = false
    el.checkUsername = () => {
      called = true
    }
    el.handleKeyDown({ key: 'Tab' })
    expect(called).to.be.false
  })

  it('renders external slot for providers', async () => {
    const el = await fixture(
      html`<app-hax-site-login
        ><div slot="externalproviders">Google</div></app-hax-site-login
      >`,
    )
    await el.updateComplete
    const slot = el.shadowRoot.querySelector('slot[name="externalproviders"]')
    expect(slot).to.exist
  })
})
