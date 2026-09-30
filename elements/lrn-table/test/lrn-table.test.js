import { fixture, expect, html } from '@open-wc/testing'

import { LrnTable } from '../lrn-table.js'

describe('lrn-table test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html` <lrn-table title="test-title"></lrn-table> `,
    )
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('registers the lrn-table tag', async () => {
    expect(LrnTable.tag).to.equal('lrn-table')
    expect(globalThis.customElements.get('lrn-table')).to.exist
  })

  it('references an external haxProperties schema file', async () => {
    const url = LrnTable.haxProperties
    expect(typeof url).to.equal('string')
    expect(url).to.contain('lrn-table.haxProperties.json')
  })

  it('emits oer:SupportingMaterial microdata with the title as oer:name', async () => {
    const wrapper = element.shadowRoot.querySelector(
      'div[typeof="oer:SupportingMaterial"]',
    )
    expect(wrapper).to.exist
    const name = element.shadowRoot.querySelector('[property="oer:name"]')
    expect(name.textContent).to.equal('test-title')
    const description = element.shadowRoot.querySelector(
      '[property="oer:description"]',
    )
    expect(description).to.exist
  })

  it('hides the oer:name title from visual presentation', async () => {
    const name = element.shadowRoot.querySelector('.hidden-title')
    expect(name.getAttribute('property')).to.equal('oer:name')
    expect(name.getAttribute('class')).to.equal('hidden-title')
  })

  it('passes csvFile, title and description into csv-render', async () => {
    element.csvFile = 'table.csv'
    element.description = 'A table of data'
    await element.updateComplete
    const csv = element.shadowRoot.querySelector('csv-render')
    expect(csv.getAttribute('data-source')).to.equal('table.csv')
    expect(csv.getAttribute('caption')).to.equal('test-title')
    expect(csv.getAttribute('summary')).to.equal('A table of data')
  })

  it('defaults csvFile and description to empty', async () => {
    const csv = element.shadowRoot.querySelector('csv-render')
    expect(csv.getAttribute('data-source')).to.equal('')
    expect(csv.getAttribute('summary')).to.equal('')
  })
})
