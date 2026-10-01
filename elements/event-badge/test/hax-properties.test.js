import { expect } from '@open-wc/testing'
import { EventBadge } from '../event-badge.js'

describe('event-badge haxProperties integration', () => {
  it('references the external haxProperties schema file next to the element', () => {
    const props = EventBadge.haxProperties
    expect(typeof props).to.equal('string')
    expect(props.endsWith('lib/event-badge.haxProperties.json')).to.equal(
      true,
    )
    // the value must be a resolvable absolute URL
    const parsed = new URL(props)
    expect(parsed.protocol).to.equal('http:')
  })

  it('serves a parseable haxProperties document from that URL', async () => {
    // fetch from the local test server only; no remote network involved
    const response = await fetch(EventBadge.haxProperties)
    expect(response.status).to.equal(200)
    const schema = await response.json()
    expect(schema.settings).to.exist
    expect(schema.settings.configure[0].property).to.exist
    expect(schema.gizmo.title).to.equal('Event Badge')
  })

  it('defines the element on the custom element registry', () => {
    expect(globalThis.customElements.get('event-badge')).to.exist
  })
})
