import { fixture, expect, html } from '@open-wc/testing'
import '../lib/map-menu-builder.js'

// direct lib import so istanbul sees lib/map-menu-builder.js statements
describe('map-menu-builder', () => {
  const tree = () => [
    {
      id: 'p1',
      title: 'Parent One',
      slug: '/parent-one',
      children: [
        { id: 'c1', title: 'Child One', slug: '/child-one', children: [] },
      ],
    },
    { id: 'l1', title: 'Leaf One', slug: '/leaf-one', children: [] },
    {
      id: 'h1',
      title: 'Hidden Parent',
      slug: '/hidden',
      children: [
        {
          id: 'h2',
          title: 'Hidden Child',
          slug: '/hidden-child',
          metadata: { hideInMenu: true },
          children: [],
        },
      ],
    },
  ]

  it('renders submenus for parents with visible children and leaf items otherwise', async () => {
    const el = await fixture(
      html`<map-menu-builder .items=${tree()}></map-menu-builder>`,
    )
    await el.updateComplete
    const submenus = el.querySelectorAll('map-menu-submenu')
    const items = el.querySelectorAll('map-menu-item')
    expect(submenus.length).to.equal(1)
    expect(submenus[0].getAttribute('itemtitle')).to.equal('Parent One')
    expect(submenus[0].getAttribute('url')).to.equal('/parent-one')
    // the nested child, the plain leaf and the hidden parent (only hidden
    // children) all render as leaf items
    expect(items.length).to.equal(3)
    const leafTitles = [...items].map((i) => i.getAttribute('itemtitle'))
    expect(leafTitles.join(',')).to.equal('Child One,Leaf One,Hidden Parent')
  })

  it('passes metadata into the rendered items', async () => {
    const el = await fixture(
      html`<map-menu-builder
        .items=${[
          {
            id: 'i1',
            title: 'Icon Item',
            slug: '/icon',
            metadata: {
              icon: 'icons:code',
              pageType: 'document',
              published: 'false',
              locked: true,
              status: 'modified',
            },
            children: [],
          },
        ]}
      ></map-menu-builder>`,
    )
    await el.updateComplete
    const item = el.querySelector('map-menu-item')
    expect(item.getAttribute('icon')).to.equal('icons:code')
    expect(item.getAttribute('icon-label')).to.equal('document')
    // published is a boolean binding: string 'false' means not published
    expect(item.hasAttribute('published')).to.equal(false)
    expect(item.hasAttribute('locked')).to.equal(true)
    expect(item.getAttribute('status')).to.equal('modified')
    // a hidden item is flagged for css to hide it
    const el2 = await fixture(
      html`<map-menu-builder
        .items=${[
          {
            id: 'i2',
            title: 'Hidden Item',
            slug: '/hidden-item',
            metadata: { hideInMenu: true },
            children: [],
          },
        ]}
      ></map-menu-builder>`,
    )
    await el2.updateComplete
    expect(el2.querySelector('map-menu-item').hasAttribute('hide-in-menu')).to
      .equal(true)
  })

  it('nests builders inside submenus with a bumped depth', async () => {
    const el = await fixture(
      html`<map-menu-builder .items=${tree()}></map-menu-builder>`,
    )
    await el.updateComplete
    const nested = el.querySelector('map-menu-submenu map-menu-builder')
    expect(nested === null).to.equal(false)
    expect(nested.getAttribute('depth-count')).to.equal('2')
    expect(nested.hasAttribute('is-nested')).to.equal(true)
    // nested items are nested too
    const nestedItem = nested.querySelector('map-menu-item')
    expect(nestedItem.hasAttribute('is-nested')).to.equal(true)
  })

  it('renders nothing beyond the max depth', async () => {
    const el = await fixture(
      html`<map-menu-builder
        .items=${tree()}
        depth-count="6"
        max-depth="5"
      ></map-menu-builder>`,
    )
    await el.updateComplete
    expect(el.children.length).to.equal(0)
  })

  it('respects the max depth for deep trees', async () => {
    const deep = {
      id: 'd1',
      title: 'Level One',
      slug: '/d1',
      children: [],
    }
    let current = deep
    for (let i = 2; i <= 7; i++) {
      const next = {
        id: `d${i}`,
        title: `Level ${i}`,
        slug: `/d${i}`,
        children: [],
      }
      current.children.push(next)
      current = next
    }
    const el = await fixture(
      html`<map-menu-builder .items=${[deep]} max-depth="3"></map-menu-builder>`,
    )
    await el.updateComplete
    // levels one through three render as submenus, deeper levels are dropped
    expect(el.querySelectorAll('map-menu-submenu').length).to.equal(3)
    expect(el.querySelectorAll('map-menu-item').length).to.equal(0)
  })

  it('hideInMenuStatus only hides when metadata says so', async () => {
    const el = await fixture(html`<map-menu-builder></map-menu-builder>`)
    expect(el.hideInMenuStatus({})).to.equal(false)
    expect(el.hideInMenuStatus({ metadata: {} })).to.equal(false)
    expect(el.hideInMenuStatus({ metadata: { hideInMenu: false } })).to.equal(
      false,
    )
    expect(el.hideInMenuStatus({ metadata: { hideInMenu: true } })).to.equal(
      true,
    )
  })

  it('hasVisibleChildren prunes empty and fully hidden submenus', async () => {
    const el = await fixture(html`<map-menu-builder></map-menu-builder>`)
    expect(el.hasVisibleChildren({})).to.equal(false)
    expect(el.hasVisibleChildren({ children: [] })).to.equal(false)
    expect(
      el.hasVisibleChildren({
        children: [{ metadata: { hideInMenu: true } }],
      }),
    ).to.equal(false)
    expect(
      el.hasVisibleChildren({
        children: [{ metadata: { hideInMenu: true } }, { id: 'ok' }],
      }),
    ).to.equal(true)
  })

  it('getPublishedStatus defaults to published', async () => {
    const el = await fixture(html`<map-menu-builder></map-menu-builder>`)
    expect(el.getPublishedStatus({})).to.equal(true)
    expect(el.getPublishedStatus({ metadata: {} })).to.equal(true)
    expect(
      el.getPublishedStatus({ metadata: { published: false } }),
    ).to.equal(false)
    expect(
      el.getPublishedStatus({ metadata: { published: 'false' } }),
    ).to.equal(false)
    expect(
      el.getPublishedStatus({ metadata: { published: true } }),
    ).to.equal(true)
  })

  it('passes edit controls and selection down the tree', async () => {
    const el = await fixture(
      html`<map-menu-builder
        .items=${tree()}
        ?edit-controls=${true}
        .selected=${'c1'}
        ?is-flex=${true}
        ?is-horizontal=${true}
      ></map-menu-builder>`,
    )
    await el.updateComplete
    const submenu = el.querySelector('map-menu-submenu')
    expect(submenu.hasAttribute('edit-controls')).to.equal(true)
    expect(submenu.getAttribute('selected')).to.equal('c1')
    expect(submenu.hasAttribute('is-flex')).to.equal(true)
    expect(submenu.hasAttribute('is-horizontal')).to.equal(true)
    const item = el.querySelector('map-menu-item')
    expect(item.getAttribute('selected')).to.equal('c1')
  })
})
