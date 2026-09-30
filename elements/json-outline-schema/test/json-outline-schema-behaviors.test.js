import { fixture, expect, html, elementUpdated, aTimeout } from '@open-wc/testing'
import {
  JsonOutlineSchema,
  JSONOutlineSchemaItem,
} from '../json-outline-schema.js'
import { JSONOutlineSchemaItem as SchemaItem } from '../lib/json-outline-schema-item.js'
import {
  varExists,
  varGet,
  objectValFromStringPos,
  valueMapTransform,
} from '@haxtheweb/utils/lib/object-path.js'
import { wipeSlot } from '@haxtheweb/utils/lib/slot.js'

describe('json-outline-schema behaviors', () => {
  describe('singleton', () => {
    let originalInstance
    beforeEach(() => {
      originalInstance = globalThis.JSONOutlineSchema.instance
    })
    afterEach(() => {
      globalThis.JSONOutlineSchema.instance = originalInstance
    })
    it('creates and returns a single instance on demand', () => {
      globalThis.JSONOutlineSchema.instance = null
      const a = globalThis.JSONOutlineSchema.requestAvailability()
      expect(a).to.exist
      expect(a.tagName.toLowerCase()).to.equal('json-outline-schema')
      expect(a.parentElement).to.equal(globalThis.document.body)
      const b = globalThis.JSONOutlineSchema.requestAvailability()
      expect(b).to.equal(a)
    })
  })

  describe('lifecycle', () => {
    it('renders a slot into the shadow root', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      expect(el.shadowRoot.querySelector('slot')).to.exist
    })
    it('fires ready and unready events on connect and disconnect', async () => {
      const ready = []
      const unready = []
      const onReady = (e) => ready.push(e.detail)
      const onUnready = (e) => unready.push(e.detail)
      // build and listen before connecting: ready fires during
      // connectedCallback and unready is dispatched after the element
      // has already been detached, so listeners must sit on the element
      const el = globalThis.document.createElement('json-outline-schema')
      el.addEventListener('json-outline-schema-ready', onReady)
      el.addEventListener('json-outline-schema-unready', onUnready)
      globalThis.document.body.appendChild(el)
      expect(ready.length).to.equal(1)
      expect(ready[0]).to.equal(true)
      el.remove()
      expect(unready.length).to.equal(1)
    })
  })

  describe('shadycss support', () => {
    let originalShadyCSS
    beforeEach(() => {
      originalShadyCSS = globalThis.ShadyCSS
    })
    afterEach(() => {
      if (originalShadyCSS === undefined) {
        delete globalThis.ShadyCSS
      } else {
        globalThis.ShadyCSS = originalShadyCSS
      }
    })
    it('styles the element and prepares the template when ShadyCSS exists', async () => {
      const calls = []
      globalThis.ShadyCSS = {
        styleElement: (el) => calls.push('style:' + el.tagName.toLowerCase()),
        prepareTemplate: (t, tag) => calls.push('prepare:' + tag),
      }
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      expect(calls).to.include('style:json-outline-schema')
      expect(calls).to.include('prepare:json-outline-schema')
    })
  })

  describe('internal helpers', () => {
    it('_setProperty assigns plain object values', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el._setProperty({ name: 'author', value: 'btopro' })
      expect(el.getAttribute('author')).to.equal('btopro')
    })
    it('_copyAttribute copies an attribute onto shadow recipients', async () => {
      const el = await fixture(
        html`<json-outline-schema title="copied"></json-outline-schema>`,
      )
      const target = globalThis.document.createElement('div')
      target.id = 'copy'
      el.shadowRoot.appendChild(target)
      el._copyAttribute('title', '#copy')
      expect(target.getAttribute('title')).to.equal('copied')
    })
    it('_copyAttribute removes the attribute when unset', async () => {
      const el = await fixture(
        html`<json-outline-schema title="copied"></json-outline-schema>`,
      )
      const target = globalThis.document.createElement('div')
      target.id = 'copy'
      target.setAttribute('missing-attr', 'stale')
      el.shadowRoot.appendChild(target)
      el._copyAttribute('missing-attr', '#copy')
      expect(target.hasAttribute('missing-attr')).to.equal(false)
    })
  })

  describe('uuid', () => {
    it('generates uuid shaped identifiers', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const uuid = el.generateUUID()
      expect(uuid).to.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      )
      expect(el.generateUUID()).to.not.equal(uuid)
    })
  })

  describe('data model', () => {
    it('clones itself as plain data', async () => {
      const el = await fixture(
        html`<json-outline-schema title="Clone me"></json-outline-schema>`,
      )
      el.id = 'clone-id'
      el.metadata = { site: { name: 'clone-site' } }
      el.addItem({ id: 'i1', title: 'First' })
      const clone = el.clone()
      // constructor defaults survive as attributes before connection
      expect(clone).to.deep.equal({
        id: 'clone-id',
        title: 'Clone me',
        author: '',
        description: '',
        license: 'by-sa',
        metadata: { site: { name: 'clone-site' } },
        items: [
          {
            id: 'i1',
            title: 'First',
            location: '',
            slug: '',
            description: '',
            parent: '',
            metadata: {},
            order: 0,
            indent: 0,
          },
        ],
      })
    })
    it('newItem returns a spec shaped item', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const item = el.newItem()
      expect(item).to.be.instanceOf(JSONOutlineSchemaItem)
      expect(item.title).to.equal('New item')
      expect(item.order).to.equal(0)
    })
    it('addItem validates and counts items', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      expect(el.addItem({ id: 'a', title: 'A' })).to.equal(1)
      expect(el.addItem({ id: 'b', title: 'B' })).to.equal(2)
      expect(el.items[1].title).to.equal('B')
      expect(el.items[0]).to.be.instanceOf(JSONOutlineSchemaItem)
    })
    it('validateItem drops unknown keys', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const safe = el.validateItem({ id: 'x', title: 'X', bogus: 'nope' })
      expect(safe).to.be.instanceOf(JSONOutlineSchemaItem)
      expect(safe.title).to.equal('X')
      expect(safe.bogus).to.equal(undefined)
    })
    it('removeItem returns the item or false', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.addItem({ id: 'a', title: 'A' })
      const removed = el.removeItem('a')
      expect(removed.id).to.equal('a')
      expect(el.items.length).to.equal(0)
      expect(el.items[0]).to.equal(undefined)
      expect(el.removeItem('nope')).to.equal(false)
    })
    it('updateItem overwrites matching items', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.addItem({ id: 'a', title: 'old' })
      expect(el.updateItem({ id: 'a', title: 'new' })).to.equal(true)
      expect(el.items[0].title).to.equal('new')
      expect(el.updateItem({ id: 'zzz', title: 'x' })).to.equal(false)
    })
    it('updateItem can save while updating', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.addItem({ id: 'a', title: 'old' })
      const saved = el.updateItem({ id: 'a', title: 'newer' }, true)
      expect(typeof saved).to.equal('string')
      expect(JSON.parse(saved).items[0].title).to.equal('newer')
    })
  })

  describe('load and save', () => {
    it('returns false without a location', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      expect(await el.load()).to.equal(false)
      expect(await el.load(null)).to.equal(false)
    })
    it('loads a schema and escalates its items', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const schema = {
        id: 'loaded-id',
        title: 'Loaded site',
        author: 'Author Name',
        description: 'A loaded site',
        license: 'MIT',
        metadata: { site: { name: 'loaded' } },
        unsupportedKey: 'nope',
        items: [
          {
            id: 'i1',
            title: 'Page 1',
            slug: 'page-1',
            order: 0,
            indent: 0,
            parent: null,
            location: 'pages/index.html',
            description: 'd1',
            metadata: { published: true },
          },
          {
            id: 'i2',
            title: 'Page 2',
            slug: 'page-2',
            order: 1,
            indent: 1,
            parent: 'i1',
            location: 'pages/page-2/index.html',
            description: 'd2',
            metadata: {},
          },
        ],
      }
      const url = 'data:application/json,' + encodeURIComponent(JSON.stringify(schema))
      expect(await el.load(url)).to.equal(true)
      expect(el.getAttribute('file')).to.equal(url)
      expect(el.title).to.equal('Loaded site')
      expect(el.author).to.equal('Author Name')
      expect(el.description).to.equal('A loaded site')
      expect(el.license).to.equal('MIT')
      expect(el.metadata).to.deep.equal({ site: { name: 'loaded' } })
      expect(el.items.length).to.equal(2)
      expect(el.items[0]).to.be.instanceOf(JSONOutlineSchemaItem)
      expect(el.items[0].id).to.equal('i1')
      expect(el.items[0].location).to.equal('pages/index.html')
      expect(el.items[0].slug).to.equal('page-1')
      expect(el.items[0].description).to.equal('d1')
      expect(el.items[1].parent).to.equal('i1')
      expect(el.items[1].indent).to.equal(1)
    })
    it('saves itself as a JSON string', async () => {
      const el = await fixture(
        html`<json-outline-schema title="Save me"></json-outline-schema>`,
      )
      el.addItem({ id: 'i1', title: 'First' })
      const parsed = JSON.parse(el.save())
      expect(parsed.title).to.equal('Save me')
      expect(parsed.license).to.equal('by-sa')
      expect(parsed.items[0].id).to.equal('i1')
    })
  })

  describe('debug mode', () => {
    it('toggles debug through the global event', async () => {
      const el = await fixture(
        html`<json-outline-schema title="Debug me"></json-outline-schema>`,
      )
      globalThis.dispatchEvent(new Event('json-outline-schema-debug-toggle'))
      expect(el.hasAttribute('debug')).to.equal(true)
      expect(el.shadowRoot.querySelector('span')).to.exist
      globalThis.dispatchEvent(new Event('json-outline-schema-debug-toggle'))
      expect(el.hasAttribute('debug')).to.equal(false)
      expect(el.shadowRoot.querySelector('span')).to.equal(null)
    })
    it('paints and repaints the debug view directly', async () => {
      const el = await fixture(
        html`<json-outline-schema title="Paint me"></json-outline-schema>`,
      )
      el._triggerDebugPaint(true)
      expect(el.shadowRoot.querySelector('span')).to.exist
      el._triggerDebugPaint(false)
      expect(el.shadowRoot.querySelector('span')).to.equal(null)
    })
    it('repaints when attributes change while debugging', async () => {
      const el = await fixture(
        html`<json-outline-schema title="Attr me"></json-outline-schema>`,
      )
      el.setAttribute('debug', 'true')
      expect(el.shadowRoot.querySelector('span')).to.exist
    })
    it('updateMetadata writes keys and repaints while debugging', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.setAttribute('debug', 'true')
      el.updateMetadata('theme', 'polaris')
      expect(el.metadata.theme).to.equal('polaris')
      expect(el.shadowRoot.querySelectorAll('span').length).to.be.at.least(1)
    })
    it('updateMetadata writes keys without debugging', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.updateMetadata('theme', 'polaris')
      expect(el.metadata.theme).to.equal('polaris')
      expect(el.shadowRoot.querySelector('span')).to.equal(null)
    })
  })

  describe('attribute backed properties', () => {
    it('reflects values once ready', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.file = 'site.json'
      el.id = 'unique-id'
      el.title = 'Reflected'
      el.author = 'Author'
      el.description = 'Description'
      el.license = 'MIT'
      expect(el.getAttribute('file')).to.equal('site.json')
      expect(el.getAttribute('id')).to.equal('unique-id')
      expect(el.getAttribute('title')).to.equal('Reflected')
      expect(el.getAttribute('author')).to.equal('Author')
      expect(el.getAttribute('description')).to.equal('Description')
      expect(el.getAttribute('license')).to.equal('MIT')
      expect(el.file).to.equal('site.json')
      expect(el.title).to.equal('Reflected')
      expect(el.debug).to.equal(null)
    })
    it('defers writes made before connection until ready', () => {
      const el = globalThis.document.createElement('json-outline-schema')
      el.title = 'Deferred write'
      globalThis.document.body.appendChild(el)
      // values written before ready are applied once connected
      expect(el.getAttribute('title')).to.equal('Deferred write')
      el.remove()
    })
  })

  describe('getItemValues', () => {
    it('validates a supplied item', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const v = el.getItemValues({ id: 'a', title: 'A', bogus: 'x' })
      expect(v).to.be.instanceOf(JSONOutlineSchemaItem)
      expect(v.title).to.equal('A')
      expect(v.bogus).to.equal(undefined)
    })
    it('returns a fresh item when nothing is supplied', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const v = el.getItemValues(null)
      expect(v).to.be.instanceOf(JSONOutlineSchemaItem)
      expect(v.title).to.equal('New item')
    })
    it('stamps the parent id onto the item', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const parentItem = el.newItem()
      const v = el.getItemValues({ id: 'child' }, parentItem)
      expect(v.parent).to.equal(parentItem.id)
    })
  })

  describe('getItemSchema', () => {
    it('builds a schema for an item', async () => {
      const el = await fixture(
        html`<json-outline-schema title="Item schema"></json-outline-schema>`,
      )
      const schema = el.getItemSchema()
      expect(schema.$schema).to.equal('http://json-schema.org/schema#')
      expect(schema.type).to.equal('object')
      expect(schema.title).to.equal('Item schema')
      expect(schema.properties.id.component.name).to.equal('paper-input')
      expect(schema.properties.title.type).to.equal('string')
      expect(schema.properties.parent.component.valueProperty).to.equal('value')
      expect(schema.properties.location.component).to.exist
      expect(schema.properties.order.component.attributes.type).to.equal(
        'number',
      )
      expect(schema.properties.metadata.type).to.equal('array')
      expect(schema.properties.order.type).to.equal('string')
      expect(schema.properties.indent.type).to.equal('string')
    })
    it('builds a schema for the outline', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.author = 'btopro'
      el.addItem({ id: 'i1', title: 'One' })
      const schema = el.getItemSchema('outline')
      expect(schema.properties.items.type).to.equal('array')
      expect(schema.properties.items.items.type).to.equal('object')
      expect(schema.properties.file.component.name).to.equal('paper-input')
      expect(schema.properties.author.value).to.equal('btopro')
    })
    it('builds a schema without items for other requests', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const schema = el.getItemSchema('anything-else')
      expect(schema.properties.items).to.equal(undefined)
      expect(schema.properties.metadata.type).to.equal('array')
      expect(schema.properties.license.type).to.equal('string')
    })
  })

  describe('hierarchy helpers', () => {
    function buildOutline(el) {
      el.addItem({
        id: 'home',
        title: 'Home',
        slug: 'home',
        location: 'pages/home/index.html',
        order: 2,
        indent: 0,
        parent: null,
      })
      el.addItem({
        id: 'about',
        title: 'About',
        slug: 'about',
        location: 'pages/about/index.html',
        order: 0,
        indent: 0,
        parent: null,
      })
      el.addItem({
        id: 'team',
        title: 'Team',
        slug: 'team',
        location: 'pages/team/index.html',
        order: 1,
        indent: 1,
        parent: 'about',
        metadata: { published: true },
      })
      el.addItem({
        id: 'contact',
        title: 'Contact',
        slug: 'contact',
        location: 'pages/contact/index.html',
        order: 1,
        indent: 0,
        parent: null,
      })
      el.addItem({
        id: 'docs',
        title: 'Docs',
        slug: 'docs',
        location: 'pages/docs/index.html',
        order: 1,
        indent: 0,
        parent: null,
      })
    }
    it('unflattens items into a sorted tree', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      buildOutline(el)
      const tree = el.unflattenItems(el.items)
      expect(tree.map((i) => i.id)).to.deep.equal([
        'about',
        'contact',
        'docs',
        'home',
      ])
      // duplicate orders are healed into sequential indexes
      expect(tree.map((i) => i.order)).to.deep.equal([0, 1, 2, 3])
      expect(tree[0].children.map((i) => i.id)).to.deep.equal(['team'])
      expect(tree[0].children[0].order).to.equal(0)
    })
    it('converts items into an html hierarchy', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      buildOutline(el)
      const ul = el.itemsToNodes()
      expect(ul.tagName).to.equal('UL')
      const lis = ul.querySelectorAll(':scope > li')
      expect(lis.length).to.equal(4)
      expect(lis[0].getAttribute('data-jos-id')).to.equal('about')
      expect(lis[0].getAttribute('data-jos-slug')).to.equal('about')
      expect(lis[0].getAttribute('data-jos-location')).to.equal(
        'pages/about/index.html',
      )
      const nested = ul.querySelectorAll('ul ul')
      expect(nested.length).to.equal(1)
      const team = nested[0].querySelector('li')
      expect(team.innerText).to.equal('Team')
      expect(team.getAttribute('data-jos-id')).to.equal('team')
      expect(team.getAttribute('data-jos-published')).to.equal('true')
    })
    it('converts an explicit item list when supplied', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      buildOutline(el)
      const ul = el.itemsToNodes([
        { id: 'only', title: 'Only', parent: null },
      ])
      expect(ul.querySelectorAll('li').length).to.equal(1)
      // empty lists fall back to the element items (5 items incl. the child)
      expect(el.itemsToNodes([]).querySelectorAll('li').length).to.equal(5)
    })
    it('round-trips itemsToNodes output back into the same outline', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      buildOutline(el)
      const ul = el.itemsToNodes(el.items.map((i) => ({ ...i })))
      const roundTripped = el.nodesToItems(ul)
      // itemsToNodes emits nested lists as siblings of their parent li
      // so the flat order follows document order with children stamped
      // onto the preceding item at that level
      expect(roundTripped.map((i) => i.id)).to.deep.equal([
        'about',
        'team',
        'contact',
        'docs',
        'home',
      ])
      const team = roundTripped.find((i) => i.id === 'team')
      expect(team.parent).to.equal('about')
      expect(team.indent).to.equal(1)
    })
  })

  describe('scrubElementJOSData', () => {
    it('strips jos attributes from nodes with children', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const host = globalThis.document.createElement('div')
      host.setAttribute('data-jos-id', 'top')
      host.setAttribute('data-jos-slug', 'top-slug')
      host.setAttribute('data-jos-location', 'pages/top/index.html')
      const child = globalThis.document.createElement('span')
      host.appendChild(child)
      el.scrubElementJOSData(host)
      expect(host.hasAttribute('data-jos-id')).to.equal(false)
      expect(host.hasAttribute('data-jos-slug')).to.equal(false)
      expect(host.hasAttribute('data-jos-location')).to.equal(false)
    })
    it('recurses into nested nodes while scrubbing', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const host = globalThis.document.createElement('div')
      host.setAttribute('data-jos-id', 'top')
      const mid = globalThis.document.createElement('span')
      mid.setAttribute('data-jos-id', 'mid')
      const leaf = globalThis.document.createElement('em')
      leaf.setAttribute('data-jos-id', 'leaf')
      mid.appendChild(leaf)
      host.appendChild(mid)
      el.scrubElementJOSData(host)
      expect(host.hasAttribute('data-jos-id')).to.equal(false)
      expect(mid.hasAttribute('data-jos-id')).to.equal(false)
      // for-in over an (even empty) HTMLCollection still runs the removals,
      // so the childless leaf gets scrubbed once the walk reaches it
      expect(leaf.hasAttribute('data-jos-id')).to.equal(false)
    })
  })

  describe('nodesToItems and getChildOutline', () => {
    function outlineHTML() {
      const host = globalThis.document.createElement('div')
      host.innerHTML = [
        '<ul>',
        '  <li data-jos-id="home" data-jos-slug="home" data-jos-location="pages/home/index.html">Home</li>',
        // leading text node title followed by a nested list is normal
        // authored markup; the walk must keep the nested children
        '  <li data-jos-id="about" data-jos-slug="about">About<ul><li data-jos-id="team" data-jos-slug="team">Team</li></ul></li>',
        '  <li>text node only</li>',
        '</ul>',
      ].join('\n')
      return host.querySelector('ul')
    }
    it('derives outline items from an html hierarchy', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const items = el.nodesToItems(outlineHTML())
      expect(items.length).to.equal(4)
      expect(items[0].id).to.equal('home')
      expect(items[0].location).to.equal('pages/home/index.html')
      expect(items[0].slug).to.equal('home')
      expect(items[0].title).to.equal('Home')
      expect(items[0].indent).to.equal(0)
      expect(items[0].order).to.equal(0)
      expect(items[0].parent).to.equal(null)
      // the wrapper li is an item in its own right with its own title
      const about = items.find((i) => i.id === 'about')
      expect(about.title).to.equal('About')
      expect(about.slug).to.equal('about')
      expect(about.indent).to.equal(0)
      expect(about.order).to.equal(1)
      expect(about.parent).to.equal(null)
      const team = items.find((i) => i.id === 'team')
      expect(team.title).to.equal('Team')
      expect(team.slug).to.equal('team')
      // one indent step for the one real nesting level
      expect(team.indent).to.equal(1)
      // children are stamped with their real containing item
      expect(team.parent).to.equal('about')
      expect(items[3].title).to.equal('text node only')
      expect(items[3].location).to.equal('')
      expect(items[3].slug).to.equal('')
    })
    it('replaces the stored items when saving', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      const items = el.nodesToItems(outlineHTML(), true)
      expect(el.items).to.equal(items)
      expect(el.items.length).to.equal(4)
    })
    it('repaints the debug view when saving while debugging', async () => {
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`)
      el.setAttribute('debug', 'true')
      el.nodesToItems(outlineHTML(), true)
      expect(el.items.length).to.equal(4)
      expect(el.shadowRoot.querySelectorAll('span').length).to.be.at.least(1)
    })
  })

  describe('class access', () => {
    it('exposes the classes for direct construction', () => {
      expect(typeof JsonOutlineSchema).to.equal('function')
      expect(new SchemaItem().title).to.equal('New item')
      const a = new SchemaItem()
      const b = new SchemaItem()
      expect(a.id).to.not.equal(b.id)
      expect(a.id).to.match(/^item-[0-9a-f]{8}-/)
    })
  })
})

describe('json-outline-schema-item lib', () => {
  it('defaults to spec values', () => {
    const item = new SchemaItem()
    expect(item.title).to.equal('New item')
    expect(item.location).to.equal('')
    expect(item.slug).to.equal('')
    expect(item.description).to.equal('')
    expect(item.parent).to.equal('')
    expect(item.metadata).to.deep.equal({})
    expect(item.order).to.equal(0)
    expect(item.indent).to.equal(0)
  })
  it('readLocation is not implemented and returns false', () => {
    expect(new SchemaItem().readLocation()).to.equal(false)
  })
  it('writeLocation is not implemented and returns false', () => {
    expect(new SchemaItem().writeLocation('body')).to.equal(false)
  })
})

describe('object-path helpers', () => {
  const obj = { a: { b: { c: 'deep' } }, list: [{ x: 1 }] }
  it('varExists checks a path', () => {
    expect(varExists(obj, 'a.b.c')).to.equal(true)
    expect(varExists(obj, 'a.b.z')).to.equal(false)
  })
  it('varGet returns a value or fallback', () => {
    expect(varGet(obj, 'a.b.c')).to.equal('deep')
    expect(varGet(obj, 'a.b.z', 'fallback')).to.equal('fallback')
    expect(varGet(obj, 'a.b.z')).to.equal('')
  })
  it('objectValFromStringPos supports brackets and null objects', () => {
    expect(objectValFromStringPos(obj, 'list[0].x')).to.equal(1)
    expect(objectValFromStringPos(null, 'a.b', 'safe')).to.equal('safe')
  })
  it('valueMapTransform maps values', () => {
    const items = [
      { title: 'A', slug: 'a' },
      { title: 'B', slug: 'b' },
    ]
    const out = valueMapTransform(items, {
      title: 'title',
      slug: 'slug',
      fixed: 'constant',
      flag: true,
      none: null,
      upper: (item) => item.title.toUpperCase(),
    })
    expect(out[0]).to.deep.equal({
      title: 'A',
      slug: 'a',
      fixed: 'constant',
      flag: true,
      none: null,
      upper: 'A',
    })
    expect(out[1].upper).to.equal('B')
  })
  it('valueMapTransform tolerates throwing mappers', () => {
    const out = valueMapTransform([{ title: 'A' }], {
      boom: () => {
        throw new Error('boom')
      },
    })
    expect(out.length).to.equal(1)
    expect(out[0].boom).to.equal(undefined)
  })
})

describe('wipeSlot', () => {
  it('wipes all slotted children by default', () => {
    const host = globalThis.document.createElement('div')
    host.innerHTML = '<span>a</span><em>b</em>'
    wipeSlot(host)
    expect(host.children.length).to.equal(0)
  })
  it('wipes only children matching a named slot', () => {
    const host = globalThis.document.createElement('div')
    host.innerHTML = '<span slot="gone">a</span><span>b</span>'
    wipeSlot(host, 'gone')
    expect(host.children.length).to.equal(1)
    expect(host.children[0].innerText).to.equal('b')
  })
})
