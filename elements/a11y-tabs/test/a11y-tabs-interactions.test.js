import { fixture, expect, html } from '@open-wc/testing'

import '../a11y-tabs.js'
import '../lib/a11y-tab.js'
import { A11yTabs } from '../a11y-tabs.js'
import { A11yTab } from '../lib/a11y-tab.js'

// wait for tab registration (firstUpdated defers via setTimeout)
const register = async (el) => {
  await el.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 100))
  await el.updateComplete
}

const threeTabs = () => fixture(html`
  <a11y-tabs id="ttabs">
    <a11y-tab id="t1" label="One" icon="icons:home">Content 1</a11y-tab>
    <a11y-tab id="t2" label="Two" icon="icons:info">Content 2</a11y-tab>
    <a11y-tab id="t3" label="Three" icon="icons:build">Content 3</a11y-tab>
  </a11y-tabs>
`)

describe('a11y-tabs statics and helpers', () => {
  it('haxProperties points at the lib schema file', () => {
    expect(
      A11yTabs.haxProperties.includes('a11y-tabs.haxProperties.json'),
    ).to.be.true
  })

  it('a11y-tab haxProperties describe the gizmo', () => {
    const props = A11yTab.haxProperties
    expect(props.canScale).to.equal(false)
    expect(props.canEditSource).to.equal(true)
    expect(props.gizmo.title).to.equal('Tab')
    expect(props.gizmo.icon).to.equal('view-day')
    const configure = props.settings.configure
    expect(configure.some((s) => s.property === 'icon')).to.be.true
    expect(configure.some((s) => s.slot === '')).to.be.true
    const advanced = props.settings.advanced
    expect(advanced.some((s) => s.property === 'flag')).to.be.true
    expect(advanced.some((s) => s.property === 'flagIcon')).to.be.true
  })

  it('generates a uuid-like string', async () => {
    const el = await threeTabs()
    await register(el)
    const uuid = el._generateUUID()
    expect(typeof uuid).to.equal('string')
    expect(uuid.includes('-')).to.be.true
    expect(uuid.length).to.be.greaterThan(8)
  })
})

describe('a11y-tabs interactions', () => {
  it('exposes the rendered tab buttons via the buttons getter', async () => {
    const el = await threeTabs()
    await register(el)
    expect(el.buttons.length).to.equal(3)
    expect(el.buttons[0].id).to.equal('t1-button')
    expect(el.buttons[0].getAttribute('role')).to.equal('tab')
  })

  it('clicking a tab button selects that tab', async () => {
    const el = await threeTabs()
    await register(el)
    el.shadowRoot.querySelector('#t2-button').click()
    await el.updateComplete
    await el.updateComplete
    expect(el.activeTab).to.equal('t2')
    const btn2 = el.shadowRoot.querySelector('#t2-button')
    const btn1 = el.shadowRoot.querySelector('#t1-button')
    expect(btn2.getAttribute('aria-selected')).to.equal('true')
    expect(btn1.getAttribute('aria-selected')).to.equal('false')
    expect(btn2.getAttribute('tabindex')).to.equal('0')
    expect(btn1.getAttribute('tabindex')).to.equal('-1')
    expect(btn2.className.includes('active')).to.be.true
    const panel1 = el.querySelector('#t1')
    const panel2 = el.querySelector('#t2')
    expect(panel1.hasAttribute('inactive')).to.be.true
    expect(panel2.hasAttribute('inactive')).to.be.false
  })

  it('does not select a disabled tab', async () => {
    const el = await fixture(html`
      <a11y-tabs>
        <a11y-tab id="d1" label="One">A</a11y-tab>
        <a11y-tab id="d2" label="Two" disabled>B</a11y-tab>
      </a11y-tabs>
    `)
    await register(el)
    expect(el.activeTab).to.equal('d1')
    el._handleTab(el.querySelector('#d2'))
    await el.updateComplete
    expect(el.activeTab).to.equal('d1')
  })

  it('ArrowRight moves focus to the next tab button', async () => {
    const el = await threeTabs()
    await register(el)
    const btn1 = el.shadowRoot.querySelector('#t1-button')
    const btn2 = el.shadowRoot.querySelector('#t2-button')
    btn1.dispatchEvent(
      new KeyboardEvent('keydown', {
        keyCode: 39,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(btn1.getAttribute('tabindex')).to.equal('-1')
    expect(btn2.getAttribute('tabindex')).to.equal('0')
    expect(el.shadowRoot.activeElement === btn2).to.be.true
  })

  it('ArrowLeft wraps from the first tab to the last', async () => {
    const el = await threeTabs()
    await register(el)
    const btn1 = el.shadowRoot.querySelector('#t1-button')
    const btn3 = el.shadowRoot.querySelector('#t3-button')
    btn1.dispatchEvent(
      new KeyboardEvent('keydown', {
        keyCode: 37,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(btn3.getAttribute('tabindex')).to.equal('0')
    expect(el.shadowRoot.activeElement === btn3).to.be.true
  })

  it('ArrowRight wraps from the last tab back to the first', async () => {
    const el = await threeTabs()
    await register(el)
    const btn1 = el.shadowRoot.querySelector('#t1-button')
    const btn3 = el.shadowRoot.querySelector('#t3-button')
    btn3.dispatchEvent(
      new KeyboardEvent('keydown', {
        keyCode: 39,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(btn1.getAttribute('tabindex')).to.equal('0')
    expect(el.shadowRoot.activeElement === btn1).to.be.true
  })

  it('arrow navigation skips disabled tab buttons', async () => {
    const el = await fixture(html`
      <a11y-tabs>
        <a11y-tab id="k1" label="One">A</a11y-tab>
        <a11y-tab id="k2" label="Two" disabled>B</a11y-tab>
        <a11y-tab id="k3" label="Three">C</a11y-tab>
      </a11y-tabs>
    `)
    await register(el)
    const btn1 = el.shadowRoot.querySelector('#k1-button')
    const btn2 = el.shadowRoot.querySelector('#k2-button')
    const btn3 = el.shadowRoot.querySelector('#k3-button')
    btn1.dispatchEvent(
      new KeyboardEvent('keydown', {
        keyCode: 39,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(btn2.getAttribute('tabindex')).to.equal('-1')
    expect(btn3.getAttribute('tabindex')).to.equal('0')
    expect(el.shadowRoot.activeElement === btn3).to.be.true
  })

  it('rebuilds the button list when key handling finds none', async () => {
    const el = await threeTabs()
    await register(el)
    // simulate a stale empty button cache
    el.__tabButtons = el.shadowRoot.querySelectorAll('#does-not-exist')
    el._handleKey(0, {
      keyCode: 39,
      preventDefault() {},
      stopPropagation() {},
    })
    expect(el.buttons.length).to.equal(3)
    expect(el.buttons[1].getAttribute('tabindex')).to.equal('0')
  })

  it('renders flag icons and tab icons together when flagged', async () => {
    const el = await fixture(html`
      <a11y-tabs>
        <a11y-tab
          id="f1"
          label="Flagged"
          flag="new"
          flag-icon="av:fiber-new"
          icon="icons:home"
          >A</a11y-tab
        >
      </a11y-tabs>
    `)
    await register(el)
    const btn = el.shadowRoot.querySelector('#f1-button')
    const icons = Array.from(btn.querySelectorAll('simple-icon-lite')).map(
      (icon) => icon.icon,
    )
    expect(icons.includes('av:fiber-new')).to.be.true
    expect(icons.includes('icons:home')).to.be.true
    const flag = btn.querySelector('.flag-type')
    expect(flag.textContent.trim()).to.equal('new')
  })

  it('renders tooltips for each button when show-tooltip is set', async () => {
    const el = await fixture(html`
      <a11y-tabs show-tooltip>
        <a11y-tab id="s1" label="One">A</a11y-tab>
        <a11y-tab id="s2" label="Two">B</a11y-tab>
      </a11y-tabs>
    `)
    await register(el)
    const tooltips = el.shadowRoot.querySelectorAll('simple-tooltip')
    expect(tooltips.length).to.equal(2)
    expect(tooltips[0].getAttribute('for')).to.equal('s1-button')
    expect(tooltips[0].textContent.includes('One')).to.be.true
  })

  // BUG: updated() line 628 checks for the property name "iconsBreakpoint"
  // but the declared property is iconBreakpoint, so an iconBreakpoint change
  // alone never re-syncs the icons-only attribute (the getter agrees but the
  // host attribute is stale). Flip when the typo is fixed.
  it('BUG: iconBreakpoint changes do not sync the icons-only attribute', async () => {
    const el = await threeTabs()
    await register(el)
    expect(el.hasAttribute('icons-only')).to.be.false
    el.iconBreakpoint = 5000
    await el.updateComplete
    // the getter already says icons-only, but the attribute was not synced
    expect(el.iconsOnly).to.be.true
    expect(el.hasAttribute('icons-only')).to.be.false
    // a responsiveWidth change does trigger the sync
    el.responsiveWidth = 400
    await el.updateComplete
    expect(el.hasAttribute('icons-only')).to.be.true
  })
})

describe('a11y-tab flag handling', () => {
  it('_handleFlag applies the flag and flag icon', async () => {
    const tab = await fixture(
      html`<a11y-tab id="flag-unit" label="Unit">X</a11y-tab>`,
    )
    expect(tab.flag).to.equal('')
    tab._handleFlag({ detail: { flag: 'alert', flagIcon: 'icons:warning' } })
    expect(tab.flag).to.equal('alert')
    expect(tab.flagIcon).to.equal('icons:warning')
  })

  // BUG: the constructor registers the a11y-tab-flag listener with
  // (e) => this.handleFlag(e) but the method is named _handleFlag, so
  // this.handleFlag is undefined and the listener always throws
  // (TypeError: this.handleFlag is not a function). Also the matching
  // removeEventListener in disconnectedCallback passes a NEW anonymous
  // function, so it could never remove the listener anyway. Flip when the
  // handler name matches and the listener reference is stored.
  it('BUG: the a11y-tab-flag listener calls the misspelled handleFlag', async () => {
    const tab = await fixture(
      html`<a11y-tab id="flag-bug" label="Bug">X</a11y-tab>`,
    )
    expect(typeof tab._handleFlag).to.equal('function')
    expect(typeof tab.handleFlag).to.equal('undefined')
    // stub the misspelled name to prove which method the listener invokes
    let calledWith = null
    tab.handleFlag = (e) => {
      calledWith = e.detail
    }
    tab.dispatchEvent(
      new CustomEvent('a11y-tab-flag', {
        detail: { flag: 'alert', flagIcon: 'icons:warning' },
        bubbles: true,
      }),
    )
    delete tab.handleFlag
    expect(calledWith !== null).to.be.true
    // the real _handleFlag never ran: the flag was not applied
    expect(tab.flag).to.equal('')
    expect(tab.flagIcon).to.equal(undefined)
  })
})
