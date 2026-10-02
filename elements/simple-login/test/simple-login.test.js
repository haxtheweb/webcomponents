import { fixture, expect, html } from "@open-wc/testing";

import "../simple-login.js";

describe("simple-login test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-login title="test-title"></simple-login>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('simple-login behavior', () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  async function validLoginFixture() {
    const el = await fixture(html`<simple-login></simple-login>`)
    await sleep(10)
    el.shadowRoot.querySelector('#userinput').value = 'testuser'
    el.shadowRoot.querySelector('#passinput').value = 'testpass'
    await el.updateComplete
    return el
  }

  it('renders the title and subtitle when supplied', async () => {
    const el = await fixture(
      html`<simple-login
        title="Sign in"
        subtitle="Use your credentials"
      ></simple-login>`,
    )
    expect(el.shadowRoot.querySelector('h1').textContent).to.equal('Sign in')
    expect(el.shadowRoot.querySelector('h2').textContent).to.equal(
      'Use your credentials',
    )
  })

  it('shows the error message text', async () => {
    const el = await fixture(
      html`<simple-login .errorMsg=${'Invalid username'}></simple-login>`,
    )
    expect(el.shadowRoot.querySelector('#errormsg').textContent.trim()).to.equal(
      'Invalid username',
    )
  })

  // FIXED (haxtheweb/issues#3102 a11y follow-up): #errormsg had no
  // aria-live/role so error text changes were never announced
  it('marks the error message as an assertive live region', async () => {
    const el = await fixture(html`<simple-login></simple-login>`)
    const err = el.shadowRoot.querySelector('#errormsg')
    expect(err.getAttribute('role')).to.equal('alert')
    expect(err.getAttribute('aria-live')).to.equal('assertive')
  })

  it('uses the default labels and button text', async () => {
    const el = await fixture(html`<simple-login></simple-login>`)
    expect(el.shadowRoot.querySelector('#userinput').getAttribute('label')).to
      .equal('User name')
    expect(el.shadowRoot.querySelector('#passinput').getAttribute('label')).to
      .equal('Password')
    expect(el.shadowRoot.querySelector('#loginbtn').textContent.trim()).to
      .equal('Login')
  })

  it('supports custom labels, error messages and button text', async () => {
    const el = await fixture(
      html`<simple-login
        user-input-label="Email"
        .userInputErrMsg=${'Email required'}
        password-input-label="Passphrase"
        .passwordInputErrMsg=${'Passphrase required'}
        login-btn-text="Sign in"
      ></simple-login>`,
    )
    expect(el.shadowRoot.querySelector('#userinput').getAttribute('label')).to
      .equal('Email')
    expect(
      el.shadowRoot.querySelector('#userinput').getAttribute('error-message'),
    ).to.equal('Email required')
    expect(el.shadowRoot.querySelector('#passinput').getAttribute('label')).to
      .equal('Passphrase')
    expect(el.shadowRoot.querySelector('#loginbtn').textContent.trim()).to
      .equal('Sign in')
  })

  it('disables the fields and button while loading', async () => {
    const el = await fixture(html`<simple-login></simple-login>`)
    expect(el.shadowRoot.querySelector('#loginbtn').hasAttribute('disabled')).to
      .equal(false)
    el.loading = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#loginbtn').hasAttribute('disabled')).to
      .equal(true)
    expect(el.shadowRoot.querySelector('#userinput').hasAttribute('disabled')).to
      .equal(true)
    expect(el.shadowRoot.querySelector('#passinput').hasAttribute('disabled')).to
      .equal(true)
    expect(
      el.shadowRoot.querySelector('simple-progress').hasAttribute('disabled'),
    ).to.equal(false)
  })

  it('notifies username and password changes', async () => {
    const el = await fixture(html`<simple-login></simple-login>`)
    let userEvent = null
    let passEvent = null
    el.addEventListener('username-changed', (e) => {
      userEvent = e.detail.value
    })
    el.addEventListener('password-changed', (e) => {
      passEvent = e.detail.value
    })
    el._usernameChanged({ detail: { value: 'admin' } })
    await el.updateComplete
    expect(el.username).to.equal('admin')
    expect(userEvent).to.equal('admin')
    el._passwordChanged({ detail: { value: 'secret' } })
    await el.updateComplete
    expect(el.password).to.equal('secret')
    expect(passEvent).to.equal('secret')
  })

  it('does not fire simple-login-login when the fields are empty', async () => {
    const el = await fixture(html`<simple-login></simple-login>`)
    let fired = false
    el.addEventListener('simple-login-login', () => {
      fired = true
    })
    el.shadowRoot.querySelector('#loginbtn').click()
    await el.updateComplete
    expect(fired).to.equal(false)
  })

  it('fires simple-login-login with the field values when valid', async () => {
    const el = await validLoginFixture()
    let loginEvent = null
    el.addEventListener('simple-login-login', (e) => {
      loginEvent = e
    })
    el.shadowRoot.querySelector('#loginbtn').click()
    await el.updateComplete
    expect(loginEvent).to.exist
    expect(loginEvent.detail.u).to.equal('testuser')
    expect(loginEvent.detail.p).to.equal('testpass')
    expect(loginEvent.bubbles).to.equal(true)
    expect(loginEvent.composed).to.equal(true)
    expect(loginEvent.cancelable).to.equal(true)
  })

  // FIXED (haxtheweb/issues#3102 a11y follow-up): Enter handling moved off
  // the deprecated keypress event to keydown with e.key === 'Enter'
  it('logs in when Enter is pressed inside the form', async () => {
    const el = await validLoginFixture()
    let loginEvent = null
    el.addEventListener('simple-login-login', (e) => {
      loginEvent = e
    })
    const enter = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    })
    el.shadowRoot.querySelector('#loginform').dispatchEvent(enter)
    await el.updateComplete
    expect(loginEvent).to.exist
    expect(loginEvent.detail.u).to.equal('testuser')
    expect(loginEvent.detail.p).to.equal('testpass')
  })

  it('ignores keys other than Enter', async () => {
    const el = await validLoginFixture()
    let fired = false
    el.addEventListener('simple-login-login', () => {
      fired = true
    })
    const other = new KeyboardEvent('keydown', {
      key: 'a',
      bubbles: true,
    })
    el.shadowRoot.querySelector('#loginform').dispatchEvent(other)
    await el.updateComplete
    expect(fired).to.equal(false)
  })
});

/*
describe("A11y/chai axe tests", () => {
  it("simple-login passes accessibility test", async () => {
    const el = await fixture(html` <simple-login></simple-login> `);
    await expect(el).to.be.accessible();
  });
  it("simple-login passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-login aria-labelledby="simple-login"></simple-login>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-login can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-login .foo=${'bar'}></simple-login>`);
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
      const el = await fixture(html`<simple-login ></simple-login>`);
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
      const el = await fixture(html`<simple-login></simple-login>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-login></simple-login>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
