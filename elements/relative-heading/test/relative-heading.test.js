import { fixture, expect, html } from '@open-wc/testing'

import { RelativeHeading } from '../relative-heading.js'

describe('relative-heading test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html`<relative-heading id="lorem">
          <h1>Lorem ipsum dolor</h1>
        </relative-heading>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <relative-heading id="praesent" parent="lorem">
          <h2>Praesent ultrices</h2>
        </relative-heading>
        <p>
          Mauris aliquam lorem justo. Praesent ultrices lorem nec est iaculis
          viverra dignissim eu neque. Nullam vitae nisl diam.
        </p>

        <relative-heading id="suspendisse" parent="praesent">
          <h3>Suspendisse</h3>
        </relative-heading>
        <p>
          Suspendisse potenti. Nulla venenatis porta felis id feugiat. Vivamus
          vehicula molestie sapien hendrerit ultricies.
        </p>

        <relative-heading id="sapien" parent="suspendisse">
          <h4>Sapien sit amet</h4>
        </relative-heading>
        <p>
          Quisque volutpat eu sapien sit amet interdum. Proin venenatis tellus
          eu nisi congue aliquet.
        </p>

        <relative-heading id="sollicitudin" parent="sapien">
          <h5>Sollicitudin</h5>
        </relative-heading>
        <p>
          Nullam at velit sollicitudin, porta mi quis, lacinia velit. Praesent
          quis mauris sem.
        </p>

        <relative-heading id="volutpat" parent="sollicitudin">
          <h6>In et volutpat</h6>
        </relative-heading>
        <p>
          In et volutpat nisi. Suspendisse vel nibh eu magna posuere
          sollicitudin. Praesent ac ex varius, facilisis urna et, cursus tellus.
        </p> `,
    )
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('relative-heading hierarchy', () => {
  it('relevels children one below their parent', async () => {
    const parent = await fixture(
      html` <relative-heading id="rh-a1">
          <h5>Wrong start</h5>
        </relative-heading>
        <relative-heading id="rh-b1" parent="rh-a1">
          <h4>Wrong child</h4>
        </relative-heading>`,
    )
    const child = document.querySelector('#rh-b1')
    await parent.updateComplete
    await child.updateComplete
    await child.updateComplete
    expect(parent.getAttribute('level')).to.equal('1')
    expect(child.getAttribute('level')).to.equal('2')
    // updateContents unwraps and rewraps content at the computed level
    expect(parent.querySelector('h1').textContent).to.equal('Wrong start')
    expect(child.querySelector('h2').textContent).to.equal('Wrong child')
    expect(child.querySelector('h4')).to.not.exist
  })

  it('uses default-level when no parent is set', async () => {
    const el = await fixture(
      html` <relative-heading id="rh-dl1" default-level="3">
        <h1>Rebased</h1>
      </relative-heading>`,
    )
    await el.updateComplete
    await el.updateComplete
    expect(el.getAttribute('default-level')).to.equal('3')
    expect(el.getAttribute('level')).to.equal('3')
    expect(el.querySelector('h3').textContent).to.equal('Rebased')
  })

  it('clamps an invalid default-level to zero instead of 1-6', async () => {
    // BUG (relative-heading-lite.js:146): the clamp expression is
    // Math.min(0, Math.max(this.defaultLevel, 6)) which can only ever
    // produce 0 or negative values, so an out-of-range default-level
    // like 7 collapses the heading to level 0 and renders an invalid
    // <h0> element. It should be Math.min(6, Math.max(level, 1)).
    const el = await fixture(
      html` <relative-heading id="rh-bad1" default-level="7">
        <h1>Broken</h1>
      </relative-heading>`,
    )
    await el.updateComplete
    await el.updateComplete
    expect(el.getAttribute('level')).to.equal('0')
    expect(el.querySelector('h0')).to.exist
  })

  it('relevels a subtree when reparented', async () => {
    const el = await fixture(
      html` <relative-heading id="rh-a2">
          <h1>Top</h1>
        </relative-heading>
        <relative-heading id="rh-b2" parent="rh-a2">
          <h2>Middle</h2>
        </relative-heading>
        <relative-heading id="rh-c2" parent="rh-b2">
          <h3>Leaf</h3>
        </relative-heading>`,
    )
    const middle = document.querySelector('#rh-b2')
    const leaf = document.querySelector('#rh-c2')
    await leaf.updateComplete
    expect(leaf.getAttribute('level')).to.equal('3')
    leaf.parent = 'rh-a2'
    await leaf.updateComplete
    await leaf.updateComplete
    expect(leaf.getAttribute('level')).to.equal('2')
    expect(leaf.querySelector('h2')).to.exist
    expect(middle.getAttribute('level')).to.equal('2')
  })

  it('generates a heading- id when none is supplied', async () => {
    const el = await fixture(
      html` <relative-heading><h2>Auto</h2></relative-heading> `,
    )
    expect(el.id.indexOf('heading-')).to.equal(0)
  })
})

describe('relative-heading copy link', () => {
  it('renders a copy-link button with the default icon and label', async () => {
    const el = await fixture(
      html` <relative-heading id="rh-btn1">
        <h2>Buttons</h2>
      </relative-heading>`,
    )
    await el.updateComplete
    const button = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(button).to.exist
    expect(button.icon).to.equal('link')
    expect(button.getAttribute('title')).to.equal('Get link')
    expect(button.label).to.equal('Get link')
    expect(el.linkAlignRight).to.be.false
  })

  it('reflects link-align-right', async () => {
    const el = await fixture(
      html` <relative-heading id="rh-btn2">
        <h2>Align</h2>
      </relative-heading>`,
    )
    el.linkAlignRight = true
    await el.updateComplete
    expect(el.hasAttribute('link-align-right')).to.be.true
  })

  it('omits the copy-link button when disable-link is set', async () => {
    const el = await fixture(
      html` <relative-heading id="rh-btn3" disable-link>
        <h2>No button</h2>
      </relative-heading>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('simple-icon-button-lite')).to.not.exist
    expect(el.disableLink).to.be.true
  })

  it('copies the heading link through the state manager', async () => {
    const el = await fixture(
      html` <relative-heading id="rh-btn4">
        <h2>Copy me</h2>
      </relative-heading>`,
    )
    const manager = el.manager
    el._handleCopyClick()
    expect(manager.copyHeading === el).to.be.true
    expect(manager.copyUrl.indexOf('#rh-btn4')).to.not.equal(-1)
    // the toast renders with the copy message text
    await manager.updateComplete
    const toast = manager.shadowRoot.querySelector('#relative-heading-toast')
    expect(toast).to.exist
    expect(toast.getAttribute('text').indexOf('Copied to Clipboard')).to.not
      .equal(-1)
    manager.closeCopyLink()
    expect(manager.shadowRoot.querySelector('#relative-heading-toast')).to.exist
  })

  it('anchored reports false without a matching anchor', async () => {
    const el = await fixture(
      html` <relative-heading id="rh-btn5">
        <h2>Anchorless</h2>
      </relative-heading>`,
    )
    expect(!!el.anchored).to.be.false
  })

  it('reports haxProperties for the editor', async () => {
    const props = RelativeHeading.haxProperties
    expect(props.canScale).to.be.true
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Relative heading')
    expect(props.settings.configure[0].property).to.equal('parent')
    expect(props.settings.advanced[0].property).to.equal('defaultLevel')
    expect(props.settings.advanced[3].property).to.equal('linkIcon')
  })
})
