import { fixture, expect, html } from '@open-wc/testing'

import '../lib/worksheet-download.js'
import { WorksheetDownload } from '../lib/worksheet-download.js'

describe('worksheet-download', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('worksheet-download')).to.exist
  })

  it('has the expected static tag', () => {
    expect(WorksheetDownload.tag).to.equal('worksheet-download')
  })

  it('has default property values', async () => {
    const el = await fixture(html`<worksheet-download></worksheet-download>`)
    expect(el.title).to.equal('')
    expect(el.link).to.equal('')
  })

  it('renders a download link with the title and file icon', async () => {
    const el = await fixture(html`
      <worksheet-download
        title="Worksheet 1"
        link="files/worksheet-1.pdf"
      ></worksheet-download>
    `)
    await el.updateComplete
    const link = el.shadowRoot.querySelector('#button_wrap a')
    expect(link.getAttribute('href')).to.equal('files/worksheet-1.pdf')
    expect(link.getAttribute('target')).to.equal('_blank')
    expect(link.hasAttribute('download')).to.be.true
    expect(link.getAttribute('rel')).to.equal('noopener noreferrer')
    expect(link.getAttribute('tabindex')).to.equal('-1')
    const button = el.shadowRoot.querySelector('button')
    expect(button.textContent).to.include('Worksheet 1')
    expect(
      el.shadowRoot.querySelector('simple-icon-lite').getAttribute('icon'),
    ).to.equal('icons:file-download')
  })

  it('exposes haxProperties with an upload-driven link setting', () => {
    const props = WorksheetDownload.haxProperties
    expect(props.canScale).to.be.false
    expect(props.gizmo.title).to.equal('Worksheet Download')
    expect(props.settings.configure.length).to.equal(2)
    expect(props.settings.configure[1].validationType).to.equal('url')
    expect(props.settings.configure[1].inputMethod).to.equal('haxupload')
    expect(props.demoSchema[0].tag).to.equal('worksheet-download')
  })

  it('wires hax hooks and blocks clicks while active in hax', () => {
    const el = globalThis.document.createElement('worksheet-download')
    expect(el.haxHooks()).to.deep.equal({
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
    let prevented = 0
    const makeEvent = () => ({
      preventDefault: () => {
        prevented += 1
      },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
    })
    // clicks pass through until hax marks the element active
    el._clickLink(makeEvent())
    expect(prevented).to.equal(0)
    el.haxactiveElementChanged(el, true)
    el._clickLink(makeEvent())
    expect(prevented).to.equal(1)
    // leaving edit mode releases the click block
    el.haxeditModeChanged(false)
    el._clickLink(makeEvent())
    expect(prevented).to.equal(1)
    // edit mode alone also blocks clicks
    el.haxeditModeChanged(true)
    el._clickLink(makeEvent())
    expect(prevented).to.equal(2)
  })
})
