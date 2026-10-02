import { fixture, expect, html } from '@open-wc/testing'
import { HAXElementCardList } from '../lib/hax-element-card-list.js'
import { InlineHaxElement } from './fixtures/inline-hax-element.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const makeList = () => [
  {
    tag: 'inline-hax-element',
    file: 'test/fixtures/inline-hax-element.js',
    schema: InlineHaxElement.haxProperties,
    showDemo: false,
  },
  {
    tag: 'other-element',
    file: 'elements/other/other.js',
    schema: {
      gizmo: {
        title: 'Other Element',
        description: 'Without demo',
        icon: 'icons:help',
        color: 'red',
        tags: ['Other'],
      },
    },
    showDemo: false,
  },
]

describe('hax-element-card-list rendering', () => {
  it('renders nothing while showCardList is false', async () => {
    const el = await fixture(
      html`<hax-element-card-list></hax-element-card-list>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.grid')).to.equal(null)
  })

  it('renders the grid with product cards from the list', async () => {
    const el = await fixture(html`
      <hax-element-card-list
        showCardList
        .list=${makeList()}
        .value=${{ 'inline-hax-element': 'test/fixtures/inline-hax-element.js' }}
        .filteredTags=${['inline-hax-element', 'other-element']}
        .cols=${2}
      ></hax-element-card-list>
    `)
    await el.updateComplete
    const cards = el.shadowRoot.querySelectorAll('product-card')
    expect(cards.length).to.equal(2)
    expect(cards[0].getAttribute('heading')).to.equal('Inline HAX Element')
    expect(cards[0].getAttribute('icon')).to.equal('icons:code')
    expect(cards[0].getAttribute('subheading')).to.equal(
      'Fixture element with inline haxProperties',
    )
    expect(cards[0].getAttribute('accent-color')).to.equal('blue')
    expect(cards[0].hasAttribute('has-demo')).to.equal(true)
    expect(cards[0].hasAttribute('disabled')).to.equal(false)
    // enabled element has a checked box
    const firstCheckbox = cards[0].querySelector('input.checkbox')
    expect(firstCheckbox.checked).to.equal(true)
    expect(
      cards[0].querySelector('label span.sr-only').textContent,
    ).to.equal('Enabled')
    // the element without a value entry is disabled and hidden from filters
    expect(cards[1].hasAttribute('disabled')).to.equal(true)
    expect(cards[1].querySelector('input.checkbox').checked).to.equal(false)
    expect(
      cards[1].querySelector('label span.sr-only').textContent,
    ).to.equal('Disabled')
    // hidden when not included in filteredTags
    const elHidden = await fixture(html`
      <hax-element-card-list
        showCardList
        .list=${makeList()}
        .value=${{}}
        .filteredTags=${['other-element']}
      ></hax-element-card-list>
    `)
    await elHidden.updateComplete
    expect(
      elHidden.shadowRoot.querySelectorAll('product-card')[0].hasAttribute(
        'hidden',
      ),
    ).to.equal(true)
    expect(
      elHidden.shadowRoot.querySelectorAll('product-card')[1].hasAttribute(
        'hidden',
      ),
    ).to.equal(false)
  })

  it('shows the loader while loading', async () => {
    const el = await fixture(html`
      <hax-element-card-list
        showCardList
        loading
        .list=${makeList()}
      ></hax-element-card-list>
    `)
    await el.updateComplete
    const loaderText = el.shadowRoot.querySelector('p.loaderText')
    expect(loaderText.hasAttribute('hidden')).to.equal(false)
    expect(loaderText.textContent.includes('Scanning Web Component Registry'))
      .to.equal(true)
    expect(el.shadowRoot.querySelector('hexagon-loader')).to.not.equal(null)
  })

  it('renders details content with tags, tag name, usage and meta', async () => {
    const el = await fixture(html`
      <hax-element-card-list
        showCardList
        .list=${makeList()}
        .value=${{}}
        .filteredTags=${['inline-hax-element', 'other-element']}
      ></hax-element-card-list>
    `)
    await el.updateComplete
    const details = el.shadowRoot.querySelectorAll(
      'product-card div[slot="details-collapse-content"]',
    )[0]
    expect(details.textContent.includes('Test,')).to.equal(true)
    expect(details.textContent.includes('Card,')).to.equal(true)
    expect(details.textContent.includes('inline-hax-element')).to.equal(true)
    expect(details.textContent.includes('test/fixtures/inline-hax-element.js'))
      .to.equal(true)
    expect(details.textContent.includes('Chemistry:')).to.equal(true)
    expect(details.textContent.includes('test fixture only')).to.equal(true)
  })

  // fix (#10): the demo view used to render ${...} expressions inside a
  // <template> element, which lit forbids ('Expressions are not supported
  // inside template elements'), so expanding a card's demo re-rendered
  // into a throw and the demo view could never display. The demo markup
  // is now injected into the code-sample template imperatively in
  // updated(). Driven through the real UX flow (collapse expand flips
  // showDemo) because a11y-collapse's initial collapse event resets a
  // pre-set showDemo before the first update completes.
  it('renders the demo view on expand and fills the code-sample template', async () => {
    const el = await fixture(html`
      <hax-element-card-list
        showCardList
        .list=${makeList()}
        .value=${{ 'inline-hax-element': 'test/fixtures/inline-hax-element.js' }}
        .filteredTags=${['inline-hax-element', 'other-element']}
      ></hax-element-card-list>
    `)
    await el.updateComplete
    el.toggleShowDemo({ detail: { expanded: true } }, 0)
    // the re-render completes instead of rejecting on the template error
    await el.updateComplete
    const card = el.shadowRoot.querySelectorAll('product-card')[0]
    const demoButton = card.querySelector(
      'div[slot="demo-collapse-content"] button',
    )
    expect(demoButton).to.not.equal(null)
    expect(demoButton.getAttribute('data-tag')).to.equal('p')
    // live demo node rendered in the .demo div
    const demoDiv = card.querySelector('div.demo')
    expect(demoDiv.querySelector('p')).to.not.equal(null)
    expect(demoDiv.textContent).to.include('fixture demo content')
    // code-sample's light-DOM template received the demo markup via the
    // imperative updated() injection
    const template = card.querySelector('code-sample > template')
    expect(template).to.not.equal(null)
    expect(template.innerHTML).to.include('<p>fixture demo content</p>')
  })
})

describe('hax-element-card-list behavior', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`
      <hax-element-card-list
        showCardList
        .list=${makeList()}
        .value=${{ 'inline-hax-element': 'test/fixtures/inline-hax-element.js' }}
        .filteredTags=${['inline-hax-element', 'other-element']}
        .cols=${2}
      ></hax-element-card-list>
    `)
    await el.updateComplete
  })

  it('productList derives status from value', () => {
    expect(el.productList.length).to.equal(2)
    expect(el.productList[0].status).to.equal(true)
    expect(el.productList[1].status).to.equal(false)
  })

  it('__getCol wraps column positions modulo cols', () => {
    expect(el.__getCol(0)).to.equal(1)
    expect(el.__getCol(1)).to.equal(2)
    expect(el.__getCol(2)).to.equal(1)
    expect(el.__getCol(3)).to.equal(2)
  })

  it('capFirst uppercases the first letter only', () => {
    expect(el.capFirst('chemistry')).to.equal('Chemistry')
    expect(el.capFirst('CSS')).to.equal('CSS')
  })

  it('elementStatusChange toggles value and fires value-changed', async () => {
    const events = []
    const handler = (e) => events.push(e)
    el.addEventListener('value-changed', handler)
    const item = el.productList[1]
    el.elementStatusChange(item)
    await el.updateComplete
    expect(item.status).to.equal(true)
    expect(el.value['other-element']).to.equal('elements/other/other.js')
    expect(events.length).to.equal(1)
    // disable again via explicit status argument
    el.elementStatusChange(item, false)
    await el.updateComplete
    expect(item.status).to.equal(false)
    expect('other-element' in el.value).to.equal(false)
    expect(events.length).to.equal(2)
    el.removeEventListener('value-changed', handler)
  })

  it('_updateItem manages value entries directly', () => {
    el._updateItem('a-tag', 'a.js', true)
    expect(el.value['a-tag']).to.equal('a.js')
    el._updateItem('a-tag', 'a.js', false)
    expect('a-tag' in el.value).to.equal(false)
  })

  it('toggleShowDemo flips the list state and re-renders the demo view', async () => {
    el.toggleShowDemo({ detail: { expanded: true } }, 0)
    expect(el.list[0].showDemo).to.equal(true)
    // fix (#10): the re-render now completes instead of rejecting on the
    // lit template-expression error, and the demo view appears
    await el.updateComplete
    const card = el.shadowRoot.querySelectorAll('product-card')[0]
    expect(
      card.querySelector('div[slot="demo-collapse-content"] button'),
    ).to.not.equal(null)
    const template = card.querySelector('code-sample > template')
    expect(template).to.not.equal(null)
    expect(template.innerHTML).to.include('fixture demo content')
  })

  it('_viewDemo opens the simple modal with the demo node', async () => {
    const container = globalThis.document.createElement('div')
    const button = globalThis.document.createElement('button')
    button.setAttribute('data-tag', 'test-element')
    const demo = globalThis.document.createElement('div')
    container.append(button, demo)
    let captured = null
    const handler = (e) => {
      captured = e
    }
    globalThis.addEventListener('simple-modal-show', handler)
    el._viewDemo({ target: button })
    expect(captured).to.not.equal(null)
    expect(captured.detail.title).to.equal('Demo of test-element')
    expect(captured.detail.invokedBy).to.equal(button)
    expect(captured.detail.elements.content).to.equal(demo)
    expect(captured.detail.clone).to.equal(true)
    expect(captured.detail.modal).to.equal(true)
    expect(captured.detail.styles['--simple-modal-width']).to.equal('80vw')
    globalThis.removeEventListener('simple-modal-show', handler)
    // without a next sibling the modal is never requested
    captured = null
    globalThis.addEventListener('simple-modal-show', handler)
    const lonely = globalThis.document.createElement('button')
    el._viewDemo({ target: lonely })
    expect(captured).to.equal(null)
    globalThis.removeEventListener('simple-modal-show', handler)
  })

  it('_haxElementToNode builds a node from a schema and empty for others', async () => {
    const node = el._haxElementToNode({
      tag: 'p',
      properties: {},
      content: 'some demo text',
    })
    expect(node.tagName.toLowerCase()).to.equal('p')
    expect(node.innerHTML).to.equal('some demo text')
    // wait for the code-sample dynamic import to resolve
    await wait(100)
    expect(el._haxElementToNode({})).to.equal('')
    expect(el._haxElementToNode(null)).to.equal('')
  })

  it('updated dispatches list change and maps cols to layout', async () => {
    const events = []
    const handler = (e) => events.push(e)
    el.addEventListener('hax-element-card-list-changed', handler)
    el.list = [...makeList(), makeList()[0]]
    await el.updateComplete
    expect(events.length).to.equal(1)
    el.removeEventListener('hax-element-card-list-changed', handler)
    el.cols = 3
    await el.updateComplete
    expect(el._layout).to.equal('1-1-1')
    el.cols = 4
    await el.updateComplete
    expect(el._layout).to.equal('1-1-1-1')
    el.cols = 6
    await el.updateComplete
    expect(el._layout).to.equal('1-1')
  })

  it('defines the element with constructor defaults', () => {
    expect(globalThis.customElements.get('hax-element-card-list')).to.exist
    const fresh = new HAXElementCardList()
    expect(fresh.showCardList).to.equal(false)
    expect(Array.isArray(fresh.list)).to.equal(true)
    expect(fresh.cols).to.equal(2)
    expect(fresh._layout).to.equal('1-1-1')
  })
})
